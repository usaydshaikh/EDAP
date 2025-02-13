import { Router } from 'express';
const router = Router();

import * as pageController from '../controllers/pagesControllers.js';

router.route('/').get(pageController.getIndextPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/contact').get(pageController.getContactPage);
router.route('/service').get(pageController.getServicesPage);
router.route('/login').get(pageController.getLoginPage);
router.route('/dashboard').get(pageController.getDashboard);
router.route('*').get(pageController.getPageNotFound);

export default router;
