export interface DBUser {
  id: string;  // Changed from _id to id for SQLite compatibility
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
  passwordHash: string;
  avatarUrl?: string;
  passwordChanged: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginIp?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

class DatabaseService {
  private dbName = 'userAuthDB';
  private dbVersion = 2;  // Increased version to trigger database upgrade
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Delete old stores if they exist
        if (db.objectStoreNames.contains('users')) {
          db.deleteObjectStore('users');
        }
        if (db.objectStoreNames.contains('devices')) {
          db.deleteObjectStore('devices');
        }

        // Create new stores with id as keyPath
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: true });
        userStore.createIndex('email', 'email', { unique: true });
        
        // Add indexes for new fields
        userStore.createIndex('createdAt', 'createdAt');
        userStore.createIndex('updatedAt', 'updatedAt');
        userStore.createIndex('isActive', 'isActive');
      };
    });
  }

  async addUser(user: DBUser): Promise<boolean> {
    if (!this.db) await this.init();

    // Ensure required fields are present
    const newUser: DBUser = {
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
      isActive: user.isActive ?? true,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      console.log('Adding user to database:', newUser);
      const request = store.add(newUser);
      request.onsuccess = () => {
        console.log('User added successfully:', newUser);
        resolve(true);
      };
      request.onerror = () => {
        console.error('Failed to add user:', request.error);
        resolve(false);
      };
    });
  }

  async getUserByUsername(username: string): Promise<DBUser | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');

      const request = index.get(username);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async updateUser(user: Partial<DBUser> & { id: string }): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      const getRequest = store.get(user.id);

      getRequest.onsuccess = () => {
        const existingUser = getRequest.result;
        if (!existingUser) {
          resolve(false);
          return;
        }

        const updatedUser = { ...existingUser, ...user };
        const updateRequest = store.put(updatedUser);

        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => resolve(false);
      };

      getRequest.onerror = () => resolve(false);
    });
  }

  async getAllUsers(): Promise<DBUser[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  }

  async deleteUser(userId: string): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      const request = store.delete(userId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async getUserData(userId: string): Promise<DBUser | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');

      const request = store.get(userId);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          const { passwordHash, ...userData } = user;
          resolve(userData as DBUser);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  async getUserDevices(userId: string): Promise<unknown[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['devices'], 'readonly');
      const store = transaction.objectStore('devices');
      const index = store.index('userId');

      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }
}

export const databaseService = new DatabaseService();
