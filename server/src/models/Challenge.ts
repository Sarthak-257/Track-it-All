import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a challenge name'],
        },
        description: {
            type: String,
            required: [true, 'Please add a challenge description'],
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        goal: {
            type: Number, // Number of days to complete
            required: true,
        },
        habits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Habit',
            },
        ],
        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                progress: {
                    type: Number,
                    default: 0,
                },
                status: {
                    type: String,
                    enum: ['active', 'completed', 'failed'],
                    default: 'active',
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
