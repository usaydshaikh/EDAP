import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateProfileUpdate,
    handleValidationErrors,
} from '../middlewares/validationMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/register', validateRegistration, handleValidationErrors('/login'), authController.registerUser);
router.post('/login', validateLogin, handleValidationErrors('/login'), authController.loginUser);
router.post('/update-profile', upload.single('profileImage'), validateProfileUpdate, handleValidationErrors('/dashboard/account'), authController.updateProfile);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors('/forgot-password'), authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, handleValidationErrors('/reset-password/:token'), authController.resetPassword);
router.get('/confirm-email/:token', authController.confirmEmail);

export default router;