// app/api/signup/route.js
import User from "@/model/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from "@/lib/DB";
import { NextResponse } from "next/server";

export async function POST(req) {
    console.log("API route hit"); // Add this
    
    try {
        console.log("Connecting to DB..."); // Add this
        await connectDB()
        
        console.log("Parsing request body..."); // Add this
        const {username, email, password} = await req.json()
        console.log("Received data:", {username, email, password: "***"}); // Add this

        if(!username || !email || !password){
            console.log("Missing fields"); // Add this
            return NextResponse.json({error: "Please fill all the fields"}, {status: 400})
        }

        console.log("Checking existing user..."); // Add this
        const existingUser = await User.findOne({email})
        if(existingUser){
            console.log("User already exists"); // Add this
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        console.log("Hashing password..."); // Add this
        const hashedPassword = await bcrypt.hash(password, 10)
        
        console.log("Creating new user..."); // Add this
        const newUser = new User({username, email, password: hashedPassword})
        await newUser.save()

        if(!newUser){
            return NextResponse.json({error: "Error creating user"}, {status: 500})
        }

        console.log("Creating token..."); // Add this
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        
        if(!token){
            return NextResponse.json({error: 'Error Creating Token'}, {status: 500})
        }

        console.log("Success! Returning response..."); // Add this
        return NextResponse.json({
            message: "User Created Successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        }, {status: 201})
        
    } catch (error) {
        console.error("API Error:", error); // Add this
        return NextResponse.json({error: "Internal Server Error", details: error.message}, {status: 500})
    }
}