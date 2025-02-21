import { Router } from 'express';
const router = Router();

import * as authController from '../controllers/authController.js';

router.route('/register').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').post(authController.logoutUser);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);

export default router;