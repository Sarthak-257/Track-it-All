import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a badge name'],
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a badge description'],
        },
        icon: {
            type: String,
            required: [true, 'Please add a badge icon'],
        },
        criteria: {
            type: { type: String, required: true },
            value: { type: Number, required: true },
        },
        rarity: {
            type: String,
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common',
        },
    },
    {
        timestamps: true,
    },
);

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
