import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { clientId, clientSecret } = await request.json()

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Client ID and Client Secret are required" }, { status: 400 })
    }

    // Test the credentials by trying to get an access token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: `Authentication failed: ${errorData.error_description || response.statusText}` },
        { status: 400 },
      )
    }

    // Successfully got a token
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error testing credentials:", error)
    return NextResponse.json({ error: "Failed to test credentials" }, { status: 500 })
  }
}

