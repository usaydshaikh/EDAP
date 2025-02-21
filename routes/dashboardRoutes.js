import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = Router();

// Apply authentication middleware to all dashboard routes
router.use(isAuthenticated);

router.get('/', dashboardController.getDashboard);
router.get('/performance', dashboardController.getPerformance);
router.get('/support', dashboardController.getSupport);
router.get('/users', dashboardController.getUsers);
router.get('/account', dashboardController.getAccount);

export default router;
