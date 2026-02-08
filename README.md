# Festival Player

Generate Spotify playlists from festival lineups.

This application helps you discover and create playlists based on festival artist lineups. Connect your Spotify account, input festival lineup data, and automatically generate playlists featuring artists from your favorite festivals.

## Features

- **Festival Lineup Processing**: Parse and process festival lineup data
- **Spotify Integration**: Authenticate with Spotify and create playlists directly in your account
- **Artist Discovery**: Automatically find tracks from festival artists
- **Playlist Generation**: Create curated playlists based on festival lineups
- **Modern Web Stack**: Built with React 18, MUI v6, and TypeScript

## Tech Stack

### Server
- **Node.js** with Express
- **TypeScript 5.7** (strict mode)
- **Spotify Web API Node** for Spotify integration
- **dotenv** for environment configuration
- **CORS** and middleware for API handling

### Client
- **React 18.3.1** with modern rendering API
- **Material-UI (MUI) v6** for component library
- **React Router v6** for navigation
- **Emotion** for CSS-in-JS styling
- **Axios** for API requests
- **React Helmet Async** for document head management
- **TypeScript 5.7** with strict type checking

## Quick Start

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **Yarn** package manager
- **Spotify Developer Account** with API credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kgstaley/spotify_playlist_generator.git
   cd festival-player
   ```

2. **Run the bootstrap script:**
   ```bash
   ./script/bootstrap
   ```

   This will:
   - Validate Node.js and Yarn installation
   - Install root dependencies
   - Install client dependencies
   - Check for .env file and provide setup guidance

3. **Configure environment variables:**

   Copy the template and add your Spotify credentials:
   ```bash
   cp script/.env.example .env
   ```

   Edit `.env` and add your Spotify API credentials:
   ```env
   SPOTIFY_ID=your_spotify_client_id_here
   SPOTIFY_SECRET=your_spotify_client_secret_here
   REDIRECT_URI=http://localhost:5000/callback
   PORT=5000
   ```

   **Get Spotify credentials at:** https://developer.spotify.com/dashboard/applications

4. **Start the development server:**
   ```bash
   ./script/start
   ```

   The application will start:
   - **Client**: http://localhost:3000
   - **Server**: http://localhost:5000

## Development

### Project Structure

This is a monorepo containing both server and client:

```
festival-player/
├── server/              # Node.js + Express backend
│   ├── server.ts        # Main server entry point
│   └── ...
├── client/              # React frontend
│   ├── src/             # React components and app code
│   ├── public/          # Static assets
│   └── package.json     # Client dependencies
├── script/              # Setup and development scripts
│   ├── bootstrap        # Initial setup script
│   ├── start            # Development/production start script
│   └── .env.example     # Environment variable template
├── dist/                # Server build output
├── package.json         # Root dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

### Available Scripts

#### Root Level Scripts

| Command | Description |
|---------|-------------|
| `yarn bootstrap` | Run initial project setup (installs all dependencies) |
| `yarn start:dev` | Start development servers (client + server concurrently) |
| `yarn start:prod` | Build and start production server |
| `yarn build` | Build server TypeScript to `dist/` |
| `yarn lint` | Lint server TypeScript files |
| `yarn dev:server` | Start server in watch mode (rebuilds on changes) |
| `yarn client` | Start client development server only |
| `yarn server` | Start production server from built files |

#### Client Scripts

Navigate to `client/` directory first:

| Command | Description |
|---------|-------------|
| `yarn start` | Start client development server (port 3000) |
| `yarn build` | Build client for production to `client/build/` |
| `yarn test` | Run client tests in watch mode |

### Development Workflow

**For local development:**
```bash
./script/start
# or
yarn start:dev
```

This runs both client (port 3000) and server (port 5000) in watch mode. Changes to client code will hot-reload. Server changes require manual restart.

**To run client or server independently:**
```bash
# Client only
cd client && yarn start

# Server only (after building)
yarn build && yarn server
```

### Environment Variables

All environment variables are configured in `.env` at the project root.

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SPOTIFY_ID` | ✅ | Spotify Client ID from your Spotify Developer Dashboard | `abc123def456...` |
| `SPOTIFY_SECRET` | ✅ | Spotify Client Secret from your Spotify Developer Dashboard | `xyz789uvw012...` |
| `REDIRECT_URI` | ✅ | OAuth callback URI (must match Spotify app settings) | `http://localhost:5000/callback` |
| `PORT` | ⚠️ | Server port (defaults to 5000 if not set) | `5000` |

**Setting up Spotify credentials:**
1. Go to https://developer.spotify.com/dashboard/applications
2. Create a new app (or use an existing one)
3. Copy the Client ID and Client Secret
4. Add `http://localhost:5000/callback` to Redirect URIs in your Spotify app settings
5. Add these values to your `.env` file

## Production Deployment

### Build and Run

```bash
./script/start --production
```

This will:
1. Validate all required environment variables are set
2. Build the server TypeScript code
3. Build the client React application
4. Start the production server

The server will serve the built client files from `client/build/` and run the API on the configured port (default: 5000).

### Production Environment Setup

Ensure your production environment has:
- Node.js installed
- All environment variables configured (especially Spotify credentials)
- Correct `REDIRECT_URI` matching your production domain
- Appropriate `PORT` configured if not using default

## Recent Changes

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

**Latest updates (2026-02-08):**
- ✨ Added bootstrap and development scripts for streamlined setup
- ⬆️ Upgraded to React 18, MUI v6, React Router v6
- 🔧 TypeScript 5.7 with strict mode enabled
- 🧪 Updated testing libraries to latest versions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run `./script/bootstrap` to set up your environment
4. Make your changes and test thoroughly
5. Run `yarn lint` to check code style
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

ISC © Kerry Staley

## Repository

- **GitHub**: https://github.com/kgstaley/spotify_playlist_generator
- **Issues**: https://github.com/kgstaley/spotify_playlist_generator/issues
