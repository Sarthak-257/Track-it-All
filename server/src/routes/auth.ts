import express from 'express';
import { registerUser, authUser, getUserProfile, verifyOTP, resendOTP } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/profile', protect, getUserProfile);

export default router;
