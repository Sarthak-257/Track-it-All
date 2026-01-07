import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habit.js';
import statsRoutes from './routes/stats.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
import challengeRoutes from './routes/challenge.js';
import reflectionRoutes from './routes/reflection.js';
import badgeRoutes from './routes/badge.js';
import validateEnv from './utils/validateEnv.js';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/badges', badgeRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

