import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';
import { registerSchema } from '../../validators/auth.validator';
import { ZodError } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const registerController = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const existingUser = UserModel.findByEmail(validatedData.email);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        const result = UserModel.create({
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword
        });

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
};