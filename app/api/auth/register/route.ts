import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    
    try {
        const {email , password } = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error: "Email and Password is required"},
                {status: 400}
            )
        }

        await connectToDatabase()

        const exUser = await User.findOne({email});

        if(exUser){
            return NextResponse.json(
                {error: "Email is already registered"},
                {status: 400}
            )
        }

        await User.create({
            email,
            password,
            role: "user",
        });


        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 201}
        )


    } catch (error) {
        return NextResponse.json(
                {error: "error in registering user in database"},
                {status: 500}
            )
    }
}
