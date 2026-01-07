import { Request, Response } from 'express';
import WeeklyReflection from '../models/WeeklyReflection.js';
import DailyLog from '../models/DailyLog.js';
import habit from '../models/Habit.js'; // Just to be safe if we need it

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get user reflections
// @route   GET /api/reflections
// @access  Private
export const getReflections = async (req: AuthRequest, res: Response) => {
    const reflections = await WeeklyReflection.find({ user: req.user._id }).sort({ weekStartDate: -1 });
    res.json(reflections);
};

// @desc    Create/Update weekly reflection
// @route   POST /api/reflections
// @access  Private
export const saveReflection = async (req: AuthRequest, res: Response) => {
    const { weekStartDate, overallMood, productivityScore, achievements, challenges, goalsForNextWeek } = req.body;

    const start = new Date(weekStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    // Auto-calculate completed habits for the week
    const logs = await DailyLog.find({
        user: req.user._id,
        date: { $gte: start, $lte: end },
        completed: true,
    });

    let reflection = await WeeklyReflection.findOne({
        user: req.user._id,
        weekStartDate: start,
    });

    if (reflection) {
        reflection.overallMood = overallMood || reflection.overallMood;
        reflection.productivityScore = productivityScore || reflection.productivityScore;
        reflection.achievements = achievements || reflection.achievements;
        reflection.challenges = challenges || reflection.challenges;
        reflection.goalsForNextWeek = goalsForNextWeek || reflection.goalsForNextWeek;
        reflection.completedHabitsCount = logs.length;
        await reflection.save();
    } else {
        reflection = await WeeklyReflection.create({
            user: req.user._id,
            weekStartDate: start,
            weekEndDate: end,
            overallMood,
            productivityScore,
            achievements,
            challenges,
            goalsForNextWeek,
            completedHabitsCount: logs.length,
        });
    }

    res.json(reflection);
};

// @desc    Generate weekly summary data for reflection
// @route   GET /api/reflections/summary
// @access  Private
export const getWeeklySummary = async (req: AuthRequest, res: Response) => {
    const { date } = req.query; // Any date within the target week
    const targetDate = new Date(date as string);

    // Find Monday of that week
    const day = targetDate.getDay();
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(targetDate.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const logs = await DailyLog.find({
        user: req.user._id,
        date: { $gte: monday, $lte: sunday },
    }).populate('habit');

    const totalCompletions = logs.filter(l => l.completed).length;
    const journals = logs.filter(l => l.journalText).map(l => ({
        habit: (l.habit as any).name,
        text: l.journalText,
        answers: l.journalPromptAnswers
    }));

    res.json({
        period: { start: monday, end: sunday },
        totalCompletions,
        journals,
    });
};
