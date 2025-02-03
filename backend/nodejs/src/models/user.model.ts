import db from '../config/database';

export interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
}

export const UserModel = {
    create: (user: User) => {
        const stmt = db.prepare(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
        );
        return stmt.run(user.username, user.email, user.password);
    },

    findByEmail: (email: string) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    },

    findById: (id: number) => {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    },

    findAll: () => {
        const stmt = db.prepare('SELECT * FROM users');
        return stmt.all();
    },

    update: (id: number, user: Partial<User>) => {
        const fields = Object.keys(user)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = Object.values(user);
        const stmt = db.prepare(
            `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        );
        return stmt.run(...values, id);
    },

    delete: (id: number) => {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        return stmt.run(id);
    }
};