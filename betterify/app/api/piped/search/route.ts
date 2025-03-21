import { NextResponse } from "next/server"

// List of Piped API instances to try
const PIPED_API_INSTANCES = [
  process.env.NEXT_PUBLIC_PIPED_API_URL || "https://pipedapi.kavin.rocks",
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.tokhmi.xyz",
  "https://pipedapi.moomoo.me",
  "https://pipedapi.syncpundit.io",
  "https://api-piped.mha.fi",
  "https://piped-api.garudalinux.org",
  "https://pipedapi.in.projectsegfau.lt",
  "https://pipedapi.leptons.xyz",
]

// Function to sanitize search terms
function sanitizeSearchTerm(term: string): string {
  // Remove special characters that might cause issues with the API
  return term.replace(/[^\w\s]/gi, " ").trim()
}

// Function to generate alternative search queries
function generateAlternativeQueries(query: string): string[] {
  const sanitized = sanitizeSearchTerm(query)
  const alternatives = [
    sanitized,
    `"${sanitized}"`,
    `${sanitized} music`,
    `${sanitized} official`,
    `${sanitized} audio`,
    `${sanitized} lyrics`,
  ]

  // If the query has multiple words, try searching for just the first few words
  const words = sanitized.split(" ")
  if (words.length > 2) {
    alternatives.push(words.slice(0, 2).join(" "))
  }

  return [...new Set(alternatives)] // Remove duplicates
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")
  const filter = url.searchParams.get("filter") || "music"

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  console.log(`Searching Piped for: "${query}"`)

  // Generate alternative queries to try if the main one fails
  const queries = generateAlternativeQueries(query)

  // Try each query until we get results
  for (const currentQuery of queries) {
    console.log(`Trying search query: "${currentQuery}"`)

    // Try each Piped API instance until one works
    for (const apiInstance of PIPED_API_INSTANCES) {
      try {
        console.log(`[SERVER] Trying Piped API: ${apiInstance} with query: ${currentQuery}`)

        // Set a timeout for the fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch(`${apiInstance}/search?q=${encodeURIComponent(currentQuery)}&filter=${filter}`, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.log(`[SERVER] Failed with API ${apiInstance}: ${response.status} `)
          continue // Try the next API instance
        }

        const data = await response.json()

        // Check if we got any results
        if (data.items && data.items.length > 0) {
          console.log(`[SERVER] Success with API ${apiInstance}, found ${data.items.length} results`)
          return NextResponse.json(data)
        } else {
          console.log(`[SERVER] Success with API ${apiInstance}, found 0 results`)
          // If we got a successful response but no results, try the next query
          break
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(`[SERVER] Request to ${apiInstance} timed out`)
        } else {
          console.log(`[SERVER] Error with API ${apiInstance}:`, error.message)
        }
        // Continue to the next API instance
      }
    }
  }

  console.log(`[SERVER] All Piped APIs failed, returning empty results`)
  // If all APIs and queries failed, return an empty result
  return NextResponse.json({ items: [] })
}

