import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    handleValidationErrors,
} from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegistration, handleValidationErrors('/register'), authController.registerUser);
router.post('/login', validateLogin, handleValidationErrors('/login'), authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors('/forgot-password'), authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, handleValidationErrors('/reset-password/:token'), authController.resetPassword);

export default router;
