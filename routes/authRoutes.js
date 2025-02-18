import { Router } from 'express';
const router = Router();

import * as authController from '../controllers/authController.js';

router.route('/register').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').post(authController.logoutUser);



export default router;
