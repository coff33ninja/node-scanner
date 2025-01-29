import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';
import { registerSchema } from '../../validators/auth.validator';
import { ZodError } from 'zod';

interface JWTPayload {
    userId: number;
}

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

        const hashedPassword = await argon2.hash(validatedData.password);

        const result = UserModel.create({
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword
        });

        const newUser = UserModel.findById(result.lastInsertRowid as number);
        if (!newUser) {
            throw new Error('Failed to create user');
        }

        const payload: JWTPayload = { userId: newUser.id! };
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Remove password from response
        const { password: _, ...userData } = newUser;

        res.status(201).json({
            status: 'success',
            data: {
                user: userData,
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