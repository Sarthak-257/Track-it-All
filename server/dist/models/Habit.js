import mongoose from 'mongoose';
const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'Please add a habit name'],
    },
    description: {
        type: String,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily',
    },
    frequencyValue: {
        type: [Number], // For weekly/custom: days of week (0-6)
        default: [0, 1, 2, 3, 4, 5, 6],
    },
    color: {
        type: String,
        default: '#4F46E5',
    },
    icon: {
        type: String,
        default: 'activity',
    },
    tags: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
