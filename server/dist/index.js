import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
// Route Middleware
app.use('/api/auth', authRoutes);
// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
