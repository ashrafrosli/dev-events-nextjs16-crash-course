import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try{
    await connectDB();

    const formData = await req.formData();

    let event;

    try{
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON data format", error: e instanceof Error ? e.message : 'Unknown error' }, { status: 400 });
    }

    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    let tags = JSON.parse(formData.get('tags') as string);
    let agenda = JSON.parse(formData.get('agenda') as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Wrap upload_stream in a Promise
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: "DevEvent" },
        (error, result) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) return reject(new Error("Invalid Cloudinary response"));
          resolve(result as { secure_url: string });
        }
      );
      stream.end(buffer);
    });

    // Assign URL to event
    event.image = uploadResult.secure_url;

    // Create the event in MongoDB
    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json({ message: "Event Created Successfully", event: createdEvent }, { status: 201 });

  } catch(e){
      console.error("Error handling POST request:", e);
      return NextResponse.json({ message: "Event Creation Failed", error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ message: "Failed to fetch events", error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}