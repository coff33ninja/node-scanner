import { Request, Response } from 'express';
import { loginSchema } from '../../validators/auth.validator';
import { ZodError } from 'zod';
import { supabase } from '../../config/supabase.config';

export const loginController = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        });

        if (error) {
            return res.status(401).json({
                status: 'error',
                message: error.message
            });
        }

        res.json({
            status: 'success',
            data: {
                user: data.user,
                session: data.session
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