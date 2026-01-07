import express from 'express';
import { getUsers, deleteUser } from '../controllers/admin.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

export default router;
