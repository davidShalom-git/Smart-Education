
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/model/User';
import Activity from '@/model/Activity';
import jwt from 'jsonwebtoken';

// Helper to connect DB (since we don't have a centralized db connect file visible yet, keeping it safe)
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning');
};

// Helper to verify token from cookie
const getUserFromToken = (req) => {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (e) {
        return null;
    }
};

export async function GET(req) {
    await connectDB();
    const userData = getUserFromToken(req);

    if (!userData) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await User.findOne({ _id: userData.userId }).select('-password'); // Exclude password

        // Fetch recent activity
        const recentActivity = await Activity.find({ userId: userData.userId })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json({
            user,
            recentActivity
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching dashboard data', error: error.message }, { status: 500 });
    }
}
