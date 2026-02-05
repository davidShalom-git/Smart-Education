
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import EnglishFile from '@/model/EnglishFile';
import TamilFile from '@/model/TamilFile';
// import SocialFile from '@/model/SocialFile'; // Ensure these models exist or import dynamically
import EnglishVideo from '@/model/EnglishVideo';
// ... import other models as needed

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

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

export async function POST(req) {
    await connectDB();
    const userData = getUserFromToken(req);

    if (!userData) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const subject = formData.get('subject'); // 'english', 'tamil', etc.
        const type = formData.get('type'); // 'files' or 'videos'

        if (!file || !title || !subject) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // 1. Upload to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: type === 'videos' ? 'video' : 'auto',
                    folder: `elearning/${subject}`
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // 2. Save to DB based on Subject & Type
        // Dynamic Model Selection Logic
        let Model;
        const key = `${subject.toLowerCase()}-${type}`;

        // Map subject+type to your specific Mongoose Models
        switch (key) {
            case 'english-files': Model = EnglishFile; break;
            case 'english-videos': Model = EnglishVideo; break;
            case 'tamil-files': Model = TamilFile; break;
            // case 'social-files': Model = SocialFile; break;

            // ... handle all cases
            default:
                // Fallback or error if model not found for subject
                if (subject === 'english' && type === 'files') Model = EnglishFile;
                else if (subject === 'english' && type === 'videos') Model = EnglishVideo;
                else if (subject === 'tamil') Model = TamilFile;
                else return NextResponse.json({ message: 'Invalid subject/type combination' }, { status: 400 });
        }

        // Create the record
        const newRecord = await Model.create({
            title,
            url: uploadResult.secure_url,
            author: userData.userId
        });

        return NextResponse.json({
            success: true,
            message: 'Uploaded successfully',
            data: newRecord
        });

    } catch (error) {
        console.error('Upload error details:', error);
        return NextResponse.json({
            message: `Upload failed: ${error.message}`,
            error: error.toString()
        }, { status: 500 });
    }
}
