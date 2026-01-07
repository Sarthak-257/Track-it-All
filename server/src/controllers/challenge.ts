import { Request, Response } from 'express';
import Challenge from '../models/Challenge.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req: AuthRequest, res: Response) => {
    const challenges = await Challenge.find();
    res.json(challenges);
};

// @desc    Create a challenge
// @route   POST /api/challenges
// @access  Private
export const createChallenge = async (req: AuthRequest, res: Response) => {
    const { name, description, startDate, endDate, goal, habits } = req.body;

    const challenge = await Challenge.create({
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        goal,
        habits,
        createdBy: req.user._id,
    });

    res.status(201).json(challenge);
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
export const joinChallenge = async (req: AuthRequest, res: Response) => {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
    }

    const isAlreadyParticipant = challenge.participants.some(
        (p) => p.user?.toString() === req.user._id.toString()
    );

    if (isAlreadyParticipant) {
        res.status(400).json({ message: 'Already joined this challenge' });
        return;
    }

    challenge.participants.push({
        user: req.user._id,
        progress: 0,
        status: 'active',
    });

    await challenge.save();
    res.json(challenge);
};

// @desc    Update challenge progress
// @route   POST /api/challenges/:id/progress
// @access  Private
export const updateChallengeProgress = async (req: AuthRequest, res: Response) => {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
    }

    const participant = challenge.participants.find(
        (p) => p.user?.toString() === req.user._id.toString()
    );

    if (!participant) {
        res.status(400).json({ message: 'Not a participant of this challenge' });
        return;
    }

    // Progress could be calculated automatically based on logs, but for now we allow manual update
    const { progress } = req.body;
    participant.progress = progress;

    if (participant.progress >= challenge.goal) {
        participant.status = 'completed';
    }

    await challenge.save();
    res.json(challenge);
};
