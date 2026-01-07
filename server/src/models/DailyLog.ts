import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        habit: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Habit',
        },
        date: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        notes: {
            type: String,
        },
        value: {
            type: mongoose.Schema.Types.Mixed, // number | boolean
        },
        percentage: {
            type: Number,
        },
        journalText: {
            type: String,
        },
        journalPromptAnswers: {
            whatWentWell: { type: String },
            whatBlockedYou: { type: String },
        },
    },
    {
        timestamps: true,
    },
);

// Compound index to ensure uniqueness per habit per day for a user
dailyLogSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

export default DailyLog;
