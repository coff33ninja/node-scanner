import { Request, Response } from 'express';
import { UserModel } from '../../models/user.model';

export const getProfileController = async (req: Request, res: Response) => {
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
};