import { Request, Response } from 'express';
import Badge from '../models/Badge.js';
import User from '../models/User.js';

// @desc    Get all available badges
// @route   GET /api/badges
// @access  Private
export const getBadges = async (req: Request, res: Response) => {
    try {
        const badges = await Badge.find({});
        res.json(badges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching badges' });
    }
};

// @desc    Get user's earned badges
// @route   GET /api/badges/user
// @access  Private
export const getUserBadges = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).populate('badges');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.badges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user badges' });
    }
};

// @desc    Seed badges (Admin only)
// @route   POST /api/badges/seed
// @access  Private/Admin
export const seedBadges = async (req: Request, res: Response) => {
    const defaultBadges = [
        {
            name: 'Genesis Protocol',
            description: 'Synchronized first habit log.',
            icon: 'Zap',
            criteria: { type: 'streak', value: 1 },
            rarity: 'common'
        },
        {
            name: 'Iron Will',
            description: 'Maintain a 7-day streak on any protocol.',
            icon: 'Shield',
            criteria: { type: 'streak', value: 7 },
            rarity: 'rare'
        },
        {
            name: 'Neural Architect',
            description: 'Create 5 custom protocols.',
            icon: 'Cpu',
            criteria: { type: 'total', value: 5 },
            rarity: 'epic'
        },
        {
            name: 'Legendary Sync',
            description: 'Achieve 100% efficiency over 30 cycles.',
            icon: 'Trophy',
            criteria: { type: 'streak', value: 30 },
            rarity: 'legendary'
        }
    ];

    try {
        await Badge.deleteMany({});
        const seeded = await Badge.insertMany(defaultBadges);
        res.json(seeded);
    } catch (error) {
        res.status(500).json({ message: 'Error seeding badges' });
    }
};
