import { Request, Response } from 'express';
import { registerSchema } from '../../validators/auth.validator';
import { ZodError } from 'zod';
import { supabase } from '../../config/supabase.config';

export const registerController = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Register user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    username: validatedData.username,
                },
            },
        });

        if (authError) {
            return res.status(400).json({
                status: 'error',
                message: authError.message
            });
        }

        if (!authData.user) {
            return res.status(400).json({
                status: 'error',
                message: 'Failed to create user'
            });
        }

        // Create user profile in Supabase database
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                username: validatedData.username,
                email: validatedData.email,
            });

        if (profileError) {
            // Attempt to clean up the auth user if profile creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create user profile'
            });
        }

        // Supabase handles the session token automatically
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    username: validatedData.username,
                },
                session: authData.session,
                message: 'Registration successful. Please check your email for verification.'
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