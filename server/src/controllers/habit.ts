import { Request, Response } from 'express';
import Habit from '../models/Habit.js';
import DailyLog from '../models/DailyLog.js';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import Challenge from '../models/Challenge.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all user habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req: AuthRequest, res: Response) => {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req: AuthRequest, res: Response) => {
    const { name, description, frequency, frequencyValue, color, icon, tags, type, targetValue, unit } = req.body;

    const habit = new Habit({
        user: req.user._id,
        name,
        description,
        frequency,
        frequencyValue,
        color,
        icon,
        tags,
        type,
        targetValue,
        unit,
    });

    const createdHabit = await habit.save();
    res.status(201).json(createdHabit);
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req: AuthRequest, res: Response) => {
    const { name, description, frequency, frequencyValue, color, icon, tags, isActive, type, targetValue, unit } = req.body;

    const habit = await Habit.findById(req.params.id);

    if (habit) {
        if (habit.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        habit.name = name || habit.name;
        habit.description = description || habit.description;
        habit.frequency = frequency || habit.frequency;
        habit.frequencyValue = frequencyValue || habit.frequencyValue;
        habit.color = color || habit.color;
        habit.icon = icon || habit.icon;
        habit.tags = tags || habit.tags;
        habit.isActive = isActive !== undefined ? isActive : habit.isActive;
        habit.type = type || habit.type;
        habit.targetValue = targetValue !== undefined ? targetValue : habit.targetValue;
        habit.unit = unit || habit.unit;

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } else {
        res.status(404).json({ message: 'Habit not found' });
    }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req: AuthRequest, res: Response) => {
    const habit = await Habit.findById(req.params.id);

    if (habit) {
        if (habit.user.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await habit.deleteOne();
        res.json({ message: 'Habit removed' });
    } else {
        res.status(404).json({ message: 'Habit not found' });
    }
};

// @desc    Toggle habit completion for a specific date
// @route   POST /api/habits/:id/toggle
// @access  Private
const toggleHabit = async (req: AuthRequest, res: Response) => {
    const { date } = req.body; // Expect date string YYYY-MM-DD
    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);
    if (!habit) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({
        user: req.user._id,
        habit: habitId,
        date: logDate,
    });

    if (log) {
        log.completed = !log.completed;
        if (log.completed && habit.type !== 'boolean') {
            log.value = habit.targetValue;
            log.percentage = 100;
        } else if (!log.completed) {
            log.value = habit.type === 'boolean' ? false : 0;
            log.percentage = 0;
        }
        await log.save();
    } else {
        log = await DailyLog.create({
            user: req.user._id,
            habit: habitId,
            date: logDate,
            completed: true,
            value: habit.type === 'boolean' ? true : habit.targetValue,
            percentage: 100,
        });
    }

    // Check for badges after completion
    if (log.completed) {
        await checkAndAwardBadges(req.user._id, habitId);
    }

    res.json(log);
};

// @desc    Update progress for numeric/percentage habits
// @route   POST /api/habits/:id/progress
// @access  Private
const updateProgress = async (req: AuthRequest, res: Response) => {
    const { date, value } = req.body;
    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);
    if (!habit) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({
        user: req.user._id,
        habit: habitId,
        date: logDate,
    });

    const numericValue = Number(value);
    const target = habit.targetValue || 100;
    const percentage = Math.min(Math.round((numericValue / target) * 100), 100);
    const isCompleted = percentage >= 100;

    if (log) {
        log.value = numericValue;
        log.percentage = percentage;
        log.completed = isCompleted;
        await log.save();
    } else {
        log = await DailyLog.create({
            user: req.user._id,
            habit: habitId,
            date: logDate,
            value: numericValue,
            percentage,
            completed: isCompleted,
        });
    }

    if (log.completed) {
        await checkAndAwardBadges(req.user._id, habitId);
    }

    res.json(log);
};

// @desc    Update journal for a habit log
// @route   POST /api/habits/:id/journal
// @access  Private
const updateJournal = async (req: AuthRequest, res: Response) => {
    const { date, journalText, whatWentWell, whatBlockedYou } = req.body;
    const habitId = req.params.id;

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({
        user: req.user._id,
        habit: habitId,
        date: logDate,
    });

    if (!log) {
        log = await DailyLog.create({
            user: req.user._id,
            habit: habitId,
            date: logDate,
            completed: false,
        });
    }

    log.journalText = journalText || log.journalText;
    log.journalPromptAnswers = {
        whatWentWell: whatWentWell || log.journalPromptAnswers?.whatWentWell,
        whatBlockedYou: whatBlockedYou || log.journalPromptAnswers?.whatBlockedYou,
    };

    await log.save();
    res.json(log);
};

// @desc    Consume streak repair token
// @route   POST /api/habits/:id/repair
// @access  Private
const repairStreak = async (req: AuthRequest, res: Response) => {
    const { date } = req.body;
    const habitId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user || user.streakRepairTokens <= 0) {
        res.status(400).json({ message: 'No streak repair tokens available' });
        return;
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    let log = await DailyLog.findOne({
        user: req.user._id,
        habit: habitId,
        date: logDate,
    });

    if (log && log.completed) {
        res.status(400).json({ message: 'Habit already completed for this date' });
        return;
    }

    if (log) {
        log.completed = true;
        log.percentage = 100;
        await log.save();
    } else {
        await DailyLog.create({
            user: req.user._id,
            habit: habitId,
            date: logDate,
            completed: true,
            percentage: 100,
        });
    }

    user.streakRepairTokens -= 1;
    await user.save();

    res.json({ message: 'Streak repaired successfully', tokensRemaining: user.streakRepairTokens });
};

// Helper to award badges
const checkAndAwardBadges = async (userId: string, habitId: string) => {
    const logs = await DailyLog.find({ user: userId, habit: habitId, completed: true }).sort({ date: 1 });
    const count = logs.length;

    // Simplified streak calc for badge awarding
    let streak = 0;
    if (count > 0) {
        // Just as an example, we'll use total count for some badges 
        // and a real streak calc would be better here.
    }

    const availableBadges = await Badge.find();
    const user = await User.findById(userId);

    for (const badge of availableBadges) {
        if (user?.badges.includes(badge._id)) continue;

        let shouldAward = false;
        if (badge.criteria === 'total_1' && count >= 1) shouldAward = true;
        if (badge.criteria === 'total_10' && count >= 10) shouldAward = true;
        if (badge.criteria === 'total_50' && count >= 50) shouldAward = true;

        if (shouldAward) {
            user?.badges.push(badge._id);
            await user?.save();
        }
    }
};

// @desc    Get habit statistics
// @route   GET /api/habits/:id/stats
// @access  Private
const getHabitStats = async (req: AuthRequest, res: Response) => {
    const habitId = req.params.id;
    const habit = await Habit.findById(habitId);

    if (!habit) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }

    const logs = await DailyLog.find({ habit: habitId, completed: true }).sort({
        date: 1,
    });

    if (logs.length === 0) {
        res.json({
            completionRate: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalCompleted: 0,
        });
        return;
    }

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    logs.forEach((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (lastDate) {
            const diffTime = Math.abs(logDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else if (diffDays > 1) {
                if (tempStreak > longestStreak) longestStreak = tempStreak;
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        lastDate = logDate;
    });

    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // Check if current streak is active (completed today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastDate) {
        const lastLogDate = new Date(lastDate);
        if (
            lastLogDate.getTime() === today.getTime() ||
            lastLogDate.getTime() === yesterday.getTime()
        ) {
            currentStreak = tempStreak;
        } else {
            currentStreak = 0;
        }
    }

    // Calculate completion rate
    const firstLogDate = new Date(logs[0].date);
    const totalDays =
        Math.ceil(Math.abs(today.getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const completionRate = (logs.length / totalDays) * 100;

    res.json({
        completionRate: Math.round(completionRate),
        currentStreak,
        longestStreak,
        totalCompleted: logs.length,
    });
};

// @desc    Get logs for a date range
// @route   GET /api/habits/logs
// @access  Private
const getLogs = async (req: AuthRequest, res: Response) => {
    const { start, end } = req.query;

    const query: any = { user: req.user._id };

    if (start && end) {
        query.date = {
            $gte: new Date(start as string),
            $lte: new Date(end as string)
        };
    }

    const logs = await DailyLog.find(query).sort({ date: 1 });
    res.json(logs);
};

export {
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
};
