import { Router } from 'express';
const router = Router();

import * as pageController from '../controllers/pagesControllers.js';

router.route('/').get(pageController.getIndextPage);
router.route('/about').get(pageController.getAboutPage);


export default router;
