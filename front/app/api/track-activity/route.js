
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/model/User';
import Activity from '@/model/Activity';
import jwt from 'jsonwebtoken';

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning');
};

const getUserFromToken = (req) => {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (e) {
        return null;
    }
};

const XP_TABLE = {
    'QUIZ': 50,
    'CHART': 30,
    'EMAIL': 10,
    'SPEECH': 20,
    'LOGIN': 5
};

export async function POST(req) {
    await connectDB();
    const userData = getUserFromToken(req);

    if (!userData) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, title, description, metadata } = body;

        let xpEarned = XP_TABLE[type] || 10;

        // Custom XP logic for Quiz Results
        if (type === 'QUIZ_RESULT' && metadata?.score) {
            xpEarned = metadata.score * 10; // 10 XP per correct answer
        }

        // 1. Create Activity Log
        const newActivity = await Activity.create({
            userId: userData.userId,
            type,
            title,
            description,
            metadata,
            xpEarned
        });

        // 2. Update User Stats & XP
        const updateFields = {
            $inc: { xp: xpEarned }
        };

        // Increment specific stats based on type
        if (type === 'QUIZ') updateFields.$inc['stats.quizzesGenerated'] = 1;
        if (type === 'CHART') updateFields.$inc['stats.chartsGenerated'] = 1;
        if (type === 'EMAIL') updateFields.$inc['stats.emailsSent'] = 1;
        if (type === 'SPEECH') updateFields.$inc['stats.minutesRecorded'] = 1; // Simplification

        // Level up logic (Simple: Every 1000 XP)
        const user = await User.findById(userData.userId);
        const currentLevel = user.level || 1;
        const newTotalXp = (user.xp || 0) + xpEarned;

        if (Math.floor(newTotalXp / 1000) + 1 > currentLevel) {
            updateFields.level = currentLevel + 1;
            // You could add a 'badge' here too
        }

        await User.findByIdAndUpdate(userData.userId, updateFields);

        return NextResponse.json({
            success: true,
            message: 'Activity recorded',
            xpEarned,
            activity: newActivity
        });

    } catch (error) {
        return NextResponse.json({ message: 'Error recording activity', error: error.message }, { status: 500 });
    }
}
