import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Clean up legacy indexes from previous project structure (Infinite Shelf)
        try {
            const userExists = await conn.connection.db.listCollections({ name: 'users' }).toArray();
            if (userExists.length > 0) {
                await conn.connection.db.collection('users').dropIndex('username_1');
                console.log('Cleaned up legacy database indexes.');
            }
        } catch (error) {
            // Index doesn't exist, which is fine
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unknown error occurred during database connection');
        }
        process.exit(1);
    }
};

export default connectDB;
