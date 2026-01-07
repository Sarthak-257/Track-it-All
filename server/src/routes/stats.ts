import express from 'express';
import {
    getWeeklyStats,
    getMonthlyStats,
    getHabitRankings,
} from '../controllers/stats.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/weekly', protect, getWeeklyStats);
router.get('/monthly', protect, getMonthlyStats);
router.get('/rankings', protect, getHabitRankings);

export default router;
