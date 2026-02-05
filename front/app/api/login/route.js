import User from "@/model/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from "@/lib/DB";
import { NextResponse } from "next/server";


export async function POST(req, res) {
    try {

        await connectDB()
        const { email, password } = await req.json()

        if (!email || !password) {
            return new NextResponse.json({ error: "Please fill all the fields" }, { status: 400 })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return new NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return new NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        if (!token) {
            return new NextResponse.json({ error: 'Error Creating Token' }, { status: 500 })
        }

        user.password = undefined;

        const response = NextResponse.json({ message: "Login Successful", token, user }, { status: 200 });

        // Set HttpOnly cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        return new NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
