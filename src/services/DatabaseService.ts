export interface DBUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
  passwordHash: string;
  avatarUrl?: string;
  passwordChanged: boolean;  // Added this property
}

class DatabaseService {
  private dbName = 'userAuthDB';
  private dbVersion = 1;
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
        if (!db.objectStoreNames.contains('users')) {
          const store = db.createObjectStore('users', { keyPath: 'id' });
          store.createIndex('username', 'username', { unique: true });
          store.createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains('devices')) {
          const store = db.createObjectStore('devices', { keyPath: 'id' });
          store.createIndex('userId', 'userId');
        }
      };
    });
  }

  async addUser(user: DBUser): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');

      console.log('Adding user to database:', user);
      const request = store.add(user);
      request.onsuccess = () => {
        console.log('User added successfully:', user);
        resolve(true);
      };
      request.onerror = () => {
        console.error('Failed to add user:', request.error);
        resolve(false);
      };

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
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
          resolve(userData);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  }

  async getUserDevices(userId: string): Promise<any[]> {
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
