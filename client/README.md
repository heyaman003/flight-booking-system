# Flight Booking System - Client

This is the Next.js client for the Flight Booking System.

## Features
- Flight search and booking UI
- User authentication and profile management
- Responsive, modern design

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for local development)
- [Docker](https://www.docker.com/) (for containerized deployment)

### Environment Variables
Create a `.env` file in the project root. Example:

```
ENV=dev # or prod
NEXT_PUBLIC_API_URL=http://localhost:3001
```

- `ENV=dev` runs the app in development mode (`npm run dev`)
- `ENV=prod` (or unset) runs the app in production mode (`npm run build` + `npm start`)
- `NEXT_PUBLIC_API_URL` should point to your backend API

### Local Development
```sh
npm install
npm run dev
```

### Production Build
```sh
npm install
npm run build
npm start
```

### Docker Usage
Build the Docker image:
```sh
docker build -t flight-booking-client .
```

Run in development mode:
```sh
docker run -e ENV=dev -e NEXT_PUBLIC_API_URL=http://localhost:3001 -p 3000:3000 flight-booking-client
```

Run in production mode:
```sh
docker run -e ENV=prod -e NEXT_PUBLIC_API_URL=http://localhost:3001 -p 3000:3000 flight-booking-client
```

## Project Structure
- `src/app/` - Next.js app directory (pages, layouts, API routes)
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/config/` - Configuration files
- `src/data/` - Static data (e.g., airports)
- `src/utils/` - Utility functions

[See Application Architecture](src/app/architecture.md)

## Screenshots

> Add screenshots of your application below. Place images in the `public/` directory and reference them here.

![Home Page Screenshot](public/screenshot-home.png)

## License
MIT
