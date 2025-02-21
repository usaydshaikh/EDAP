import { Router } from 'express';
const router = Router();

import * as dashboardController from '../controllers/dashboardController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

router.route('/').get(isAuthenticated, dashboardController.getDashboard);
router.route('/performance').get(isAuthenticated, dashboardController.getPerformance);
router.route('/support').get(isAuthenticated, dashboardController.getSupport);
router.route('/users').get(isAuthenticated, dashboardController.getUsers);
router.route('/account').get(isAuthenticated, dashboardController.getAccount);

export default router;
