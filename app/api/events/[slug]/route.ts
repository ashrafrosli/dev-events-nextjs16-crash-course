import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { IEvent } from "@/database/event.model";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Retrieves event details by slug
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    // Extract and validate slug from route params
    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug });

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${sanitizedSlug}" not found` },
        { status: 404 }
      );
    }

    // Return event details
    return NextResponse.json(
      { message: "Event retrieved successfully", event },
      { status: 200 }
    );
  } catch (error) {
    // Handle database or unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Check if it's a Mongoose validation or cast error
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid slug format", error: errorMessage },
        { status: 400 }
      );
    }

    // Log server errors for debugging
    console.error("GET /api/events/[slug] error:", error);

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
