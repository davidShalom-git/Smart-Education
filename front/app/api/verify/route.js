// app/api/verify-token/route.js
import jwt from 'jsonwebtoken';
import User from '@/model/User';
import connectDB from '@/lib/DB';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectDB();
        
        // Get token from Authorization header
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No token provided' }, 
                { status: 401 }
            );
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' }, 
                { status: 404 }
            );
        }
        
        // Return user data
        return NextResponse.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                { error: 'Invalid token' }, 
                { status: 401 }
            );
        }
        
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { error: 'Token expired' }, 
                { status: 401 }
            );
        }
        
        return NextResponse.json(
            { error: 'Server error' }, 
            { status: 500 }
        );
    }
}