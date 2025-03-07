# Contents of `/music-streaming-app/music-streaming-app/README.md`

# Music Streaming App

This project is a music streaming application that integrates with the Spotify API for user authentication and playlist management, and the YouTube Music API for ad-free music playback.

## Features

- User authentication with Spotify
- Fetch and display user playlists
- Play, pause, and skip tracks using YouTube Music API
- Responsive design for web and mobile platforms

## Technologies Used

- React
- TypeScript
- Spotify API
- YouTube Music API
- Capacitor for mobile app development

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd music-streaming-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Spotify API credentials:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=<your-client-id>
   REACT_APP_SPOTIFY_CLIENT_SECRET=<your-client-secret>
   ```

5. Start the development server:
   ```
   npm start
   ```

## Building for Mobile

To build the app for Android and iOS, ensure you have Capacitor installed and follow the instructions in the Capacitor documentation.

## License

This project is licensed under the MIT License.