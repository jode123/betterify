# README.md

# Spotify Playlist Viewer

This project is a web application built with React Native and React Native Web that allows users to view their Spotify playlists in a user interface inspired by Apple Music. The application fetches playlists from the Spotify API and displays them in a visually appealing format.

## Features

- Fetch and display user playlists from Spotify
- Responsive design suitable for both web and mobile
- Clean and modern UI inspired by Apple Music

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- A Spotify Developer account to obtain API credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/spotify-playlist-viewer.git
   ```

2. Navigate to the project directory:

   ```bash
   cd spotify-playlist-viewer
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and add your Spotify API credentials:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

### Deployment

This application can be deployed on Vercel. Follow the instructions on the Vercel website to connect your GitHub repository and deploy your application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.