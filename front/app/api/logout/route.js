import { NextResponse } from "next/server";

export async function POST(req,res){
    return NextResponse.json({message: "Logout Successful"},{status: 200})
}
