import { authOption } from "@/lib/auth"; // Fixed typo
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json(videos ?? [], { status: 200 });

    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOption); // Fixed typo
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const body: IVideo = await request.json();

        // Fixed `thumbnailUrl` typo & corrected HTTP status code
        if (!body.title || !body.description || !body.videoUrl ) {
            return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100,
            }
        };

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json(
            { error: "Failed to upload video" },
            { status: 500 }
        );
    }
}
