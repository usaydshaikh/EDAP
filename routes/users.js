import express from 'express';
import { Op } from 'sequelize';
import User from '../models/usersModel.js';
import { searchUsers } from '../controllers/userController.js';

const router = express.Router();
console.log('Script is running');
router.get('/search', searchUsers);
export default router;
