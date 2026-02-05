import connectDB from '@/lib/DB';
import EnglishVideo from '@/model/EnglishVideo';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const videos = await EnglishVideo.find({});

        if (!videos) {
            return NextResponse.json({ message: "No videos found" }, { status: 404 });
        }

        return NextResponse.json({ data: videos }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
