# VidSpace

## Overview

This project is a video streaming application built using FFmpeg for video processing. It consists of a backend server and a frontend client, allowing users to upload, process, and stream videos.

## Architecture

- **Backend**: Node.js server handling video processing, storage, and API endpoints.
- **Frontend**: Web client (built with Vite/React) for user interaction and video playback.

## Project Structure

- `backend/`: Contains the server-side code, including controllers, models, routes, and video storage.
- `frontend/`: Contains the client-side code, including React, Vite, and other dependencies.

## Backend Details

- **Key Files**:
  - `index.js`: Main server entry point.
  - `package.json`: Node.js dependencies and scripts.
  - `controllers/`: API endpoint handlers.
  - `models/`: Data models.
  - `routes/`: API route definitions.
  - `utils/`: Utility functions.
  - `videos/`: Directory for stored videos.
  - `thumbnails/`: Directory for video thumbnails.
- **Technologies**: Node.js, FFmpeg for video processing.

## Frontend Details

- **Key Files**:
  - `index.html`: Main HTML file.
  - `vite.config.js`: Vite configuration for building the frontend.
  - `package.json`: Frontend dependencies and scripts.
  - `src/`: Source code directory.
  - `public/`: Public assets.
- **Technologies**: Vite, React, Node.js, FFmpeg for video processing.

## Installation

1. **Backend Setup**:
   - Navigate to `backend/` directory.
   - Run `npm install` to install dependencies.
   - Configure environment variables in `.env` file (e.g., port, database settings).
   - Start the server with `npm start` or `node index.js`.

2. **Frontend Setup**:
   - Navigate to `frontend/` directory.
   - Run `npm install` to install dependencies.
   - Start the development server with `npm run dev`.

## Usage

- Upload videos through the frontend interface.
- The backend processes videos using FFmpeg and stores them in the `videos/` directory.
- Stream videos via the provided API endpoints.

## Demo Video

<video src="VidSpace.mp4" controls width="600" height="400" style="max-width: 100%;" preload="auto" muted loop />

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is for demonstration purposes. Adjust licensing as needed.
