import { Router } from 'express';
import {validateContactForm, validateReplyForm, handleValidationErrors} from '../middlewares/validationMiddleware.js';
import * as contactMsgController from '../controllers/contactMsgController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// dont forget to add the validation middleware
router.post('/', validateContactForm, handleValidationErrors('/contact') ,contactMsgController.saveContactMessage);
router.post('/reply-message/:messageID', validateReplyForm, handleValidationErrors('/dashboard/contact-messages'), 
    contactMsgController.replyToMessage
);
router.post('/delete-message/:messageID', AuthMiddleware.hasPermission(7), contactMsgController.deleteMessage);

export default router;