import { Request, Response } from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            otp,
            otpExpire,
        });

        if (user) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Track It All - Account Verification',
                    message: `Your verification code is: ${otp}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                            <h2 style="color: #22d3ee; text-align: center;">Track It All</h2>
                            <p>Welcome, <b>${name}</b>!</p>
                            <p>Please use the following code to verify your account. It will expire in 10 minutes.</p>
                            <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px;">
                                <h1 style="letter-spacing: 5px; color: #0f172a; margin: 0;">${otp}</h1>
                            </div>
                            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
                        </div>
                    `,
                });

                res.status(201).json({
                    message: 'Verification code sent to email.',
                    email: user.email,
                });
            } catch (error) {
                console.error('Email error:', error);
                res.status(500).json({ message: 'User created, but verification email could not be sent. Please request a new code.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Registration failed. Please try again.' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'Account is already verified' });
    }

    if (user.otp !== otp) {
        user.otpAttempts += 1;
        await user.save();
        if (user.otpAttempts >= 5) {
            // Optional: Block or something. For now just standard error.
            return res.status(400).json({ message: 'Too many failed attempts. Please resend a new OTP.' });
        }
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.otpExpire && user.otpExpire < new Date()) {
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as unknown as string),
    });
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpire = otpExpire;
        user.otpAttempts = 0;
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: 'Track It All - New Verification Code',
                message: `Your new verification code is: ${otp}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #22d3ee; text-align: center;">Track It All</h2>
                        <p>Use the following code to verify your account:</p>
                        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px;">
                            <h1 style="letter-spacing: 5px; color: #0f172a; margin: 0;">${otp}</h1>
                        </div>
                    </div>
                `,
            });

            res.json({ message: 'New verification code sent to your email.' });
        } catch (error) {
            console.error('Email error during resend:', error);
            res.status(500).json({ message: 'Failed to send code. Please try again later.' });
        }
    } catch (error: any) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your account first.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id as unknown as string),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { registerUser, authUser, getUserProfile, verifyOTP, resendOTP };
