# README.md

# Spotify Next.js App

This project is a web application built with Next.js that connects to the Spotify API to fetch and display your playlists in a user interface inspired by Apple Music.

## Features

- Fetches user playlists from the Spotify API
- Displays playlists in a visually appealing layout
- Includes a music player for track playback
- Responsive design for various screen sizes

## Project Structure

```
spotify-nextjs-app
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components
│   │   ├── Sidebar.tsx
│   │   ├── PlaylistCard.tsx
│   │   ├── Player.tsx
│   │   └── Header.tsx
│   ├── lib
│   │   ├── spotify.ts
│   │   └── auth.ts
│   ├── types
│   │   └── index.ts
│   └── styles
│       └── index.css
├── public
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.local
└── README.md
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd spotify-nextjs-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Spotify API credentials:
   ```
   SPOTIFY_CLIENT_ID=<your-client-id>
   SPOTIFY_CLIENT_SECRET=<your-client-secret>
   SPOTIFY_REDIRECT_URI=<your-redirect-uri>
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the MIT License.