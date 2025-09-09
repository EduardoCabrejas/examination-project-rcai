import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Obtener datos de la API externa
    const response = await fetch(
      "https://prod2.readychatai.com/business/mock-messages",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Optional to always get fresh data
        cache: "no-store",
      }
    );

    // Verify the response
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse data
    const data = await response.json();

    // Optional: add logs
    console.log("API Response:", data);

    // Return data
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
