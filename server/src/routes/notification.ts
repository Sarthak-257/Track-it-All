import express from 'express';
import { sendReminder } from '../controllers/notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/remind', protect, sendReminder);

export default router;
