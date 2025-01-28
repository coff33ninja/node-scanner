import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ZodError } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            // Validate input
            const validatedData = registerSchema.parse(req.body);

            // Check if user already exists
            const existingUser = UserModel.findByEmail(validatedData.email);
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(validatedData.password, salt);

            // Create user
            const result = UserModel.create({
                username: validatedData.username,
                email: validatedData.email,
                password: hashedPassword
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: result.lastInsertRowid },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        id: result.lastInsertRowid,
                        username: validatedData.username,
                        email: validatedData.email
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

            console.error('Registration error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    async login(req: Request, res: Response) {
        try {
            // Validate input
            const validatedData = loginSchema.parse(req.body);

            // Find user
            const user = UserModel.findByEmail(validatedData.email);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
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
    },

    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const user = UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const { password, ...userWithoutPassword } = user;
            res.json({
                status: 'success',
                data: {
                    user: userWithoutPassword
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};