import connectDB from "../../../lib/DB";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from "../../../config/uploadToCloud";
import SocialVideo from '../../../model/SocialVideo';

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;

    const formData = await req.formData();
    const title = formData.get('title');
    const file = formData.get('file');

    if (!title || !file) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, file.type);

    const newVideo = new SocialVideo({
      title,
      author: userId,
      url: uploadResult.secure_url,
    });

    await newVideo.save();

    return NextResponse.json({ message: 'Video uploaded successfully', video: newVideo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {

    await connectDB();

    const getData = await SocialVideo.find({});
    if (!getData) {
      return NextResponse.json({ message: "no Data" }, { status: 404 })
    }

    return NextResponse.json({ message: "Success", data: getData }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}