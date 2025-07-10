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

# ✈️ How to Use the Flight Booking App

Welcome to the Flight Booking App! This guide will walk you through using the app, with helpful screenshots and tips for a smooth experience.

---

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Searching for Flights](#searching-for-flights)
3. [Booking a Flight](#booking-a-flight)
4. [Viewing Your Bookings](#viewing-your-bookings)
5. [Tips & Sample Search](#tips--sample-search)
6. [All Screenshots & Use Cases](#all-screenshots--use-cases)
7. [More Information](#more-information)

---

## Getting Started

1. **Open the app in your browser** (usually at [http://localhost:3000](http://localhost:3000) if running locally).
2. **Sign up or log in** to your account.

![Login Page](./public/Screenshot%202025-07-10%20at%201.04.08%E2%80%AFPM.png)

---

## Searching for Flights

1. On the home/search page, enter your flight details:
   - **From:** Enter the airport code (e.g., BOM)
   - **To:** Enter the airport code (e.g., DEL)
   - **Departure Date:** Choose your travel date (e.g., 2025-07-15)
   - **Return Date:** (Optional, for round-trip)
   - **Passengers & Class:** Select as needed
2. Click **Search Flights**.

![Search Form](./public/Screenshot%202025-07-10%20at%2010.0444%E2%80%AFPM.png)

---

## Booking a Flight

1. Browse the search results.
2. Click **Book** on your preferred flight.
3. Fill in passenger details and confirm your booking.

![Flight Results](./public/Screenshot%202025-07-10%20at%m2010.04.51%E2%80%AFPM.png)

---

## Viewing Your Bookings

1. Go to your **Profile** or **Booking History** page.
2. See all your current and past bookings.

![Booking History](./publi/Screenshot%202025-07-10%20at%2010.04.56%E2%80%AFPM.png)

---

## Tips & Sample Search

- **Sample Data:**
  - Try searching for flights from **BOM** (Mumbai) to **DEL** (Delhi) on **2025-07-15**. This route has data available for demo/testing.
  - You can also try round-trip searches by selecting a return date.
- **Screenshots:**
  - More screenshots are available in the `public/` folder for reference.

![Sample Search](./public/Screenshot%202025-07-10%20a%2010.05.10%E2%80%AFPM.png)

---

## All Screenshots & Use Cases

Below are all screenshots available in the `public/` folder, with a brief description of their use case:

- ![Login Page](./public/Screenshot%202025-07-10%20a%2010.04.08%E2%80%AFPM.png)
  - **Login/Signup Screen:** The entry point for users to sign in or create an account.
- ![Flight Search Form](./public/Screenshot%202025-07-10%20a%2010.04.44%E2%80%AFPM.png)
  - **Flight Search Form:** Where users enter their flight search criteria.
- ![Flight Results](./public/Screenshot%202025-07-10%20a%2010.04.51%E2%80%AFPM.png)
  - **Flight Results:** Displays available flights based on the search.
- ![Booking History](./public/Screenshot%202025-07-10%20a%2010.04.56%E2%80%AFPM.png)
  - **Booking History:** Shows a user's past and current bookings.
- ![Booking Modal](./public/Screenshot%202025-07-1020at%2010.04.27%E2%80%AFPM.png)
  - **Booking Modal:** The modal where users enter passenger details and confirm a booking.
- ![Booking Confirmation](./public/Screenshot%202025-07-1020at%2010.04.01%E2%80%AFPM.png)
  - **Booking Confirmation:** Confirmation screen after a successful booking.
- ![User Profile](./public/Screenshot%202025-07-10%20a%2010.03.32%E2%80%AFPM.png)
  - **User Profile:** Displays user information and settings.
- ![Edit Profile](./publi/Screenshot%202025-07-10%20at%2010.03.22%E2%80%AFPM.png)
  - **Edit Profile:** Allows users to update their profile details.
- ![Flight Details](./public/Screenshot%202025-07-10%20a%2010.03.15%E2%80%AFPM.png)
  - **Flight Details:** Shows detailed information about a selected flight.
- ![Payment Page](.public/Screenshot%202025-07-10%20at%2010.02.59%E2%80%AFPM.png)
  - **Payment Page:** Where users enter payment information to complete a booking.
- ![Payment Success](./public/Screenshot%202025-07-10%20a%2010.02.51%E2%80%AFPM.png)
  - **Payment Success:** Confirmation of successful payment.
- ![Error/Empty State](./publi/Screenshot%202025-07-10%20at%2010.02.43%E2%80%AFPM.png)
  - **Error/Empty State:** Shown when no results are found or an error occurs.
- ![Sample Search](./public/Screenshot%202025-07-1020at%2010.05.10%E2%80%AFPM.png)
  - **Sample Search:** Example of a successful search with results.

---

## More Information

- For a full overview of the project, see the [Main Project README](../Readme.md).

---

Enjoy exploring and booking your flights! If you have questions, check the main documentation or reach out to the project maintainers.
