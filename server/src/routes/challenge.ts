import express from 'express';
import {
    getChallenges,
    createChallenge,
    joinChallenge,
    updateChallengeProgress,
} from '../controllers/challenge.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getChallenges).post(protect, createChallenge);
router.post('/:id/join', protect, joinChallenge);
router.post('/:id/progress', protect, updateChallengeProgress);

export default router;
