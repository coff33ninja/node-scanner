import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';
import { loginSchema } from '../../validators/auth.validator';
import { ZodError } from 'zod';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const DB_PATH = path.join(__dirname, '../../../database.sqlite');

export const loginController = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const dbExists = fs.existsSync(DB_PATH);

        // Handle first-run scenario
        if (!dbExists && 
            validatedData.email === 'admin@abcd.1234' && 
            validatedData.password === 'abcd1234!') {
            const token = jwt.sign(
                { 
                    id: 'first-run-admin',
                    isFirstRun: true 
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return res.json({
                status: 'success',
                data: {
                    user: {
                        id: 'first-run-admin',
                        username: 'admin',
                        email: 'admin@abcd.1234',
                        isFirstRun: true
                    },
                    token
                }
            });
        }

        const user = UserModel.findByEmail(validatedData.email);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }

        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};