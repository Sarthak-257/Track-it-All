import mongoose from 'mongoose';

const weeklyReflectionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        weekStartDate: {
            type: Date,
            required: true,
        },
        weekEndDate: {
            type: Date,
            required: true,
        },
        overallMood: {
            type: String,
        },
        productivityScore: {
            type: Number,
            min: 1,
            max: 10,
        },
        achievements: {
            type: String,
        },
        challenges: {
            type: String, // What was difficult this week
        },
        goalsForNextWeek: {
            type: String,
        },
        completedHabitsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

// Compound index to ensure one reflection per user per week
weeklyReflectionSchema.index({ user: 1, weekStartDate: 1 }, { unique: true });

const WeeklyReflection = mongoose.model('WeeklyReflection', weeklyReflectionSchema);

export default WeeklyReflection;
