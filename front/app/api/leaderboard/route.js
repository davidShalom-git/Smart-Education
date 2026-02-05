
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/model/User';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning');
};

export async function GET() {
    await connectDB();
    try {
        // Fetch top 10 users sorted by XP
        const leadership = await User.find({})
            .sort({ xp: -1 })
            .limit(10)
            .select('username xp level badges stats'); // Select only public info

        return NextResponse.json(leadership);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching leaderboard' }, { status: 500 });
    }
}
