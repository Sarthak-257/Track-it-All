import express from 'express';
import { getBadges, getUserBadges, seedBadges } from '../controllers/badge.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBadges);
router.get('/user', protect, getUserBadges);
router.post('/seed', protect, seedBadges);

export default router;
