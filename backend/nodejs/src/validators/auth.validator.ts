import { body } from 'express-validator';

// Validation for registration
export const validateRegistration = [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation for login
export const validateLogin = [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
];
