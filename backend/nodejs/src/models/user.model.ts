import db from '../config/database';
import bcrypt from 'bcrypt';

export interface UserPreferences {
    language: string;
    theme: string;
    notifications: boolean;
}

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    name: string;
    role?: string;
    lastActive?: Date;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    preferences?: UserPreferences;
}

export const UserModel = {
    async create(user: User) {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const stmt = db.prepare(`
            INSERT INTO users (
                username, email, password, name, role,
                is_active, preferences, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);

        const result = stmt.run(
            user.username,
            user.email,
            hashedPassword,
            user.name,
            user.role || 'user',
            user.isActive !== false, // default to true if not specified
            JSON.stringify(user.preferences || {
                language: 'en',
                theme: 'system',
                notifications: true
            })
        );

        if (result.lastInsertRowid) {
            return this.findById(Number(result.lastInsertRowid));
        }
        return null;
    },

    findOne(criteria: Partial<User>) {
        const conditions = Object.entries(criteria)
            .map(([key, _]) => `${key} = ?`)
            .join(' AND ');

        const stmt = db.prepare(`SELECT * FROM users WHERE ${conditions}`);
        const result = stmt.get(...Object.values(criteria));

        if (result) {
            return this.transformDatabaseResult(result);
        }
        return null;
    },

    findByEmail(email: string) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const result = stmt.get(email);
        return result ? this.transformDatabaseResult(result) : null;
    },

    findById(id: number) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const result = stmt.get(id);
        return result ? this.transformDatabaseResult(result) : null;
    },

    findAll() {
        const stmt = db.prepare('SELECT * FROM users');
        const results = stmt.all();
        return results.map(result => this.transformDatabaseResult(result));
    },

    update(id: number, user: Partial<User>) {
        const updates = Object.entries(user)
            .map(([key, _]) => `${this.toSnakeCase(key)} = ?`)
            .join(', ');

        const stmt = db.prepare(`
            UPDATE users
            SET ${updates}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(...Object.values(user), id);
        return result.changes > 0;
    },

    delete(id: number) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    },

    async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, user.password);
    },

    // Utility method to transform snake_case database results to camelCase
    private transformDatabaseResult(result: any) {
        const transformed: any = {};

        for (const [key, value] of Object.entries(result)) {
            const camelKey = this.toCamelCase(key);

            if (key === 'preferences' && typeof value === 'string') {
                transformed[camelKey] = JSON.parse(value);
            } else {
                transformed[camelKey] = value;
            }
        }

        return transformed as User;
    },

    private toCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    },

    private toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
};
