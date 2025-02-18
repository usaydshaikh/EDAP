import { Router } from 'express';
const router = Router();

import * as dashboardController from '../controllers/dashboardController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

router.route('/').get(isAuthenticated, dashboardController.getDashboard);
router.route('/performance').get(dashboardController.getPerformance);
router.route('/support').get(dashboardController.getSupport);
router.route('/users').get(dashboardController.getUsers);
router.route('/account').get(dashboardController.getAccount);

export default router;
