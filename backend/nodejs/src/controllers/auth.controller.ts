import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { generateApiKey } from '../utils/apiKeyGenerator';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const user = await UserModel.create(req.body);
            if (user) {
                // Generate initial API key
                const apiKey = generateApiKey(user.id!, 'Initial Key');
                
                const token = jwt.sign({ id: user.id }, JWT_SECRET, {
                    expiresIn: '24h'
                });
                
                res.status(201).json({
                    user,
                    token,
                    apiKey // Send API key only on initial registration
                });
            } else {
                res.status(400).json({ message: 'Failed to create user' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findByEmail(email);
            if (user && await UserModel.comparePassword(user, password)) {
                const token = jwt.sign({ id: user.id }, JWT_SECRET, {
                    expiresIn: '24h'
                });
                res.json({ user, token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    async getProfile(req: Request, res: Response) {
        try {
            const user = req.user;
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
};
