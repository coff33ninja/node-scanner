import { registerController } from './auth/register.controller';
import { loginController } from './auth/login.controller';
import { getProfileController } from './auth/profile.controller';

export const AuthController = {
    register: registerController,
    login: loginController,
    getProfile: getProfileController
};