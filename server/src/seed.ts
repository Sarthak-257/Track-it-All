import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from './models/Badge.js';
import Challenge from './models/Challenge.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing
        await Badge.deleteMany();
        await Challenge.deleteMany();

        // 1. Seed Badges
        const badges = await Badge.create([
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
        ]);

        console.log('✅ Neural Distinctions seeded.');

        // 2. Seed Challenges
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 30);

        await Challenge.create([
            {
                name: 'Neon Sprint',
                description: 'Complete 10 habits in the next 30 days to optimize your core performance.',
                startDate: today,
                endDate: endDate,
                goal: 10,
                habits: [], // Global
                participants: []
            },
            {
                name: 'Deep Sync Operation',
                description: 'Maintain 100% efficiency for 7 consecutive cycles.',
                startDate: today,
                endDate: endDate,
                goal: 7,
                habits: [],
                participants: []
            }
        ]);

        console.log('✅ Neural Quests seeded.');

        console.log('🚀 SYSTEM SEED COMPLETE.');
        process.exit();
    } catch (error) {
        console.error('❌ SEED ERROR:', error);
        process.exit(1);
    }
};

seedData();
