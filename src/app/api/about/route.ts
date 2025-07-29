import { client } from "../../../sanity/lib/client";
import { NextResponse } from "next/server";

const aboutQuery = `*[_type == "about"][0]{
  email,
  linkedin,
  github
}`;

export async function GET() {
  try {
    const aboutData = await client.fetch(aboutQuery);
    
    if (!aboutData) {
      return NextResponse.json({ error: "About data not found" }, { status: 404 });
    }

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error("Failed to fetch about data:", error);
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
} 