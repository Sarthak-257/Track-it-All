import express from 'express';
import {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    updateProgress,
    updateJournal,
    repairStreak,
    getHabitStats,
    getLogs,
} from '../controllers/habit.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/logs', protect, getLogs);
router.route('/').get(protect, getHabits).post(protect, createHabit);
router
    .route('/:id')
    .put(protect, updateHabit)
    .delete(protect, deleteHabit);
router.route('/:id/toggle').post(protect, toggleHabit);
router.route('/:id/progress').post(protect, updateProgress);
router.route('/:id/journal').post(protect, updateJournal);
router.route('/:id/repair').post(protect, repairStreak);
router.route('/:id/stats').get(protect, getHabitStats);

export default router;
