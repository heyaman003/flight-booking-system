# Flight Booking System API

👉 **See full architecture and module breakdown in [ARCHITECTURE.md](./ARCHITECTURE.md)**

A robust, modular flight booking backend built with NestJS, featuring authentication, flight search, booking management, real-time updates, and more.

---

## Features

- **User Authentication**: JWT-based authentication with Supabase
- **Flight Search**: Advanced search with multiple filters (origin, destination, dates, passengers, cabin class)
- **Booking Management**: Create, update, cancel bookings with e-ticket generation
- **Real-time Updates**: Server-Sent Events for flight status updates
- **Email Notifications**: Automated email confirmations and updates
- **User Profiles**: Profile management with personal information
- **Booking History**: Complete booking history for registered users

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with Supabase Auth
- **Real-time**: Server-Sent Events (SSE)
- **Email**: Nodemailer
- **Validation**: Class-validator, Class-transformer
- **Testing**: Jest

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password

   # App Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**

   Create the following tables in your Supabase database:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     phone VARCHAR(20),
     address TEXT,
     city VARCHAR(100),
     country VARCHAR(100),
     postal_code VARCHAR(20),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Flights table
   CREATE TABLE flights (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     flight_number VARCHAR(20) NOT NULL,
     airline VARCHAR(100) NOT NULL,
     origin VARCHAR(100) NOT NULL,
     destination VARCHAR(100) NOT NULL,
     departure_time TIMESTAMP NOT NULL,
     arrival_time TIMESTAMP NOT NULL,
     duration INTEGER NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     available_seats INTEGER NOT NULL,
     cabin_class VARCHAR(20) NOT NULL,
     aircraft VARCHAR(100),
     status VARCHAR(20) DEFAULT 'scheduled',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Bookings table
   CREATE TABLE bookings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     flight_id UUID REFERENCES flights(id),
     return_flight_id UUID REFERENCES flights(id),
     passengers JSONB NOT NULL,
     cabin_class VARCHAR(20) NOT NULL,
     total_price DECIMAL(10,2) NOT NULL,
     status VARCHAR(20) DEFAULT 'pending',
     booking_reference VARCHAR(20) UNIQUE NOT NULL,
     special_requests TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/bookings` - Get user booking history (Protected)

### Flights
- `POST /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking details (Protected)
- `PUT /api/bookings/:id` - Update booking (Protected)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

### Real-time Updates
- `GET /api/sse/connect/:clientId` - Connect to SSE for real-time updates
- `GET /api/sse/status` - Get SSE connection status

## API Examples

### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### Flight Search
```bash
curl -X POST http://localhost:3000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "JFK",
    "destination": "LAX",
    "departureDate": "2024-01-15",
    "adults": 2,
    "children": 1,
    "cabinClass": "economy",
    "tripType": "round_trip"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "flightId": "flight-uuid",
    "passengers": [
      {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01",
        "passportNumber": "AB123456",
        "nationality": "US"
      }
    ],
    "cabinClass": "economy"
  }'
```

## Real-time Updates

The API supports real-time updates using Server-Sent Events (SSE). Connect to the SSE endpoint to receive live updates:

```javascript
const eventSource = new EventSource('/api/sse/connect/client123');

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received update:', data);
};

eventSource.onerror = function(error) {
  console.error('SSE error:', error);
};
```

## Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 24h) |

| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | No (default: 587) |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `PORT` | Application port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── users/               # User management module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── flights/             # Flight management module
│   ├── flights.controller.ts
│   ├── flights.service.ts
│   └── dto/
├── bookings/            # Booking management module
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   └── dto/
├── common/              # Shared components
│   ├── dto/
│   ├── guards/
│   ├── decorators/
│   ├── services/
│   └── controllers/
├── config/              # Configuration
│   ├── configuration.ts
│   └── supabase.service.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
