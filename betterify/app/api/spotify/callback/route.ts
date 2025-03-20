export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")

  // Handle errors from Spotify
  if (error) {
    return Response.redirect(`${url.origin}/settings?error=${error}`)
  }

  // If we don't have code or state, something went wrong
  if (!code || !state) {
    return Response.redirect(`${url.origin}/settings?error=missing_params`)
  }

  // Verify state matches what we stored (to prevent CSRF attacks)
  const storedState = url.searchParams.get("stored_state")
  if (storedState && state !== storedState) {
    return Response.redirect(`${url.origin}/settings?error=state_mismatch`)
  }

  try {
    // Get client ID and secret from query parameters (passed from the client)
    const clientId = url.searchParams.get("client_id")
    const clientSecret = url.searchParams.get("client_secret")

    if (!clientId || !clientSecret) {
      return Response.redirect(`${url.origin}/settings?error=missing_credentials`)
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${url.origin}/api/spotify/callback`,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Token exchange error:", errorData)
      return Response.redirect(`${url.origin}/settings?error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()

    // Redirect to the front-end with a temporary code
    // We'll use this code to store the tokens in localStorage from the client-side
    return Response.redirect(
      `${url.origin}/settings?auth_success=true&access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}&expires_in=${tokenData.expires_in}`,
    )
  } catch (error) {
    console.error("Error in Spotify callback:", error)
    return Response.redirect(`${url.origin}/settings?error=server_error`)
  }
}

