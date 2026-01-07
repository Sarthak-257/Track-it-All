import { Request, Response } from 'express';
import Habit from '../models/Habit.js';
import DailyLog from '../models/DailyLog.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get weekly completion overview
// @route   GET /api/stats/weekly
// @access  Private
const getWeeklyStats = async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const habits = await Habit.find({ user: req.user._id, isActive: true });
    const logs = await DailyLog.find({
        user: req.user._id,
        date: { $gte: sevenDaysAgo, $lte: today },
        completed: true,
    });

    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const completedCount = logs.filter(
            (log) => log.date.toISOString().split('T')[0] === dateStr,
        ).length;

        weeklyData.push({
            date: dateStr,
            completed: completedCount,
            total: habits.length,
        });
    }

    res.json(weeklyData);
};

// @desc    Get monthly completion overview
// @route   GET /api/stats/monthly
// @access  Private
const getMonthlyStats = async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const habits = await Habit.find({ user: req.user._id, isActive: true });
    const logs = await DailyLog.find({
        user: req.user._id,
        date: { $gte: thirtyDaysAgo, $lte: today },
        completed: true,
    });

    const monthlyData = [];

    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        const completedCount = logs.filter(
            (log) => log.date.toISOString().split('T')[0] === dateStr,
        ).length;

        monthlyData.push({
            date: dateStr,
            completed: completedCount,
            total: habits.length,
        });
    }

    res.json(monthlyData);
};

// @desc    Get habit rankings (best/worst)
// @route   GET /api/stats/rankings
// @access  Private
const getHabitRankings = async (req: AuthRequest, res: Response) => {
    const habits = await Habit.find({ user: req.user._id });

    const rankings = await Promise.all(
        habits.map(async (habit) => {
            const logsCount = await DailyLog.countDocuments({
                habit: habit._id,
                completed: true,
            });

            // Total days since creation or first log
            const firstLog = await DailyLog.findOne({ habit: habit._id }).sort({ date: 1 });
            let totalDays = 0;
            if (firstLog) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                totalDays = Math.ceil(Math.abs(today.getTime() - firstLog.date.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            } else {
                // If no logs, use creation date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                totalDays = Math.ceil(Math.abs(today.getTime() - (habit as any).createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            }

            const rate = totalDays > 0 ? (logsCount / totalDays) * 100 : 0;

            return {
                _id: habit._id,
                name: habit.name,
                count: logsCount,
                rate: Math.round(rate),
            };
        }),
    );

    rankings.sort((a, b) => b.rate - a.rate);

    res.json({
        best: rankings[0] || null,
        worst: rankings[rankings.length - 1] || null,
        all: rankings,
    });
};

export { getWeeklyStats, getMonthlyStats, getHabitRankings };
