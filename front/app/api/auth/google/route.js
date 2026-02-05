
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import User from '@/model/User';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning');
};

export async function POST(req) {
    try {
        const body = await req.json();

        let googleId, email, name, picture;

        if (body.type === 'profile' && body.googleProfile) {
            // Unverified Profile Mode (UI Flexibility Trade-off)
            googleId = body.googleProfile.sub;
            email = body.googleProfile.email;
            name = body.googleProfile.name;
            picture = body.googleProfile.picture;
        } else if (body.googleToken) {
            // Classic Verified Token Mode
            const ticket = await client.verifyIdToken({
                idToken: body.googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            googleId = payload.sub;
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        } else {
            return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
        }

        await connectDB();

        // 2. Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // New User
            user = await User.create({
                username: name,
                email,
                googleId,
                profilePicture: picture,
                role: 'student', // Default role
                // password is not required for google users
            });

            // Optional: You could log this "Signup" activity to XP system here
        } else {
            // Existing User - Link Google ID if not present
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = user.profilePicture || picture;
                await user.save();
            }
        }

        // 3. Create Session Token (Same as normal login)
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: { username: user.username, email: user.email, role: user.role }
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600 // 1 hour
        });

        return response;

    } catch (error) {
        console.error('Google Auth Error:', error);
        return NextResponse.json({ message: 'Google Authentication failed', error: error.message }, { status: 401 });
    }
}
