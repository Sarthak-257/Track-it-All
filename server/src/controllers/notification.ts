import { Request, Response } from 'express';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Send a daily reminder to the logged in user
// @route   POST /api/notifications/remind
// @access  Private
const sendReminder = async (req: AuthRequest, res: Response) => {
    const habits = await Habit.find({ user: req.user._id, isActive: true });

    if (habits.length === 0) {
        return res.status(400).json({ message: 'No active habits to remind about.' });
    }

    const habitList = habits.map(h => `- ${h.name}`).join('\n');
    const htmlList = habits.map(h => `<li>${h.name}</li>`).join('');

    try {
        await sendEmail({
            email: req.user.email,
            subject: "Today's Habit Reminder 🚀",
            message: `Hi ${req.user.name},\n\nDon't forget to track your habits today:\n${habitList}\n\nStay consistent!`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg">
          <h2 style="color: #4f46e5">Daily Habit Reminder</h2>
          <p>Hi ${req.user.name},</p>
          <p>Don't forget to check off your habits today:</p>
          <ul style="color: #334155">${htmlList}</ul>
          <p style="margin-top: 20px; font-weight: bold; color: #4f46e5">Keep up the great work!</p>
        </div>
      `,
        });

        res.json({ message: 'Reminder email sent' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

export { sendReminder };
