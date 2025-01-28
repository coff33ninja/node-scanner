import db from '../config/database';

export interface Network {
    id?: number;
    user_id: number;
    name: string;
    mac_address: string;
    ip_address?: string;
    created_at?: Date; // Changed to Date type
    updated_at?: Date; // Changed to Date type
}

export const NetworkModel = {
    create: (network: Network) => {
        const stmt = db.prepare(
            'INSERT INTO networks (user_id, name, mac_address, ip_address, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
        );
        return stmt.run(network.user_id, network.name, network.mac_address, network.ip_address);
    },

    findByUserId: (userId: number) => {
        const stmt = db.prepare('SELECT * FROM networks WHERE user_id = ?');
        return stmt.all(userId);
    },

    findById: (id: number) => {
        const stmt = db.prepare('SELECT * FROM networks WHERE id = ?');
        return stmt.get(id);
    },

    update: (id: number, network: Partial<Network>) => {
        const fields = Object.keys(network)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = Object.values(network);
        const stmt = db.prepare(
            `UPDATE networks SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        );
        return stmt.run(...values, id);
    },

    delete: (id: number) => {
        const stmt = db.prepare('DELETE FROM networks WHERE id = ?');
        return stmt.run(id);
    }
};
