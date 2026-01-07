import express from 'express';
import {
    getReflections,
    saveReflection,
    getWeeklySummary,
} from '../controllers/reflection.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getReflections).post(protect, saveReflection);
router.get('/summary', protect, getWeeklySummary);

export default router;
