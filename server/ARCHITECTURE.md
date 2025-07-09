# Flight Booking System Architecture

## High-Level Architecture

```
+-------------------+         +---------------------+         +---------------------+
|  User/Frontend    | <-----> |  NestJS API Server  | <-----> |   Supabase (DB/Auth)|
+-------------------+         +---------------------+         +---------------------+
         ^                             |   ^                             |
         |                             |   |                             |
         |                             v   |                             v
         |                    +---------------------+           +-------------------+
         |                    |  SMTP Email Server  |           |  SSE (Real-time)  |
         +------------------->+---------------------+<----------+-------------------+
```

- **Frontend** communicates with the **NestJS API** via REST and SSE.
- **NestJS API** handles business logic, authentication, and data orchestration.
- **Supabase** provides Postgres database and authentication.
- **SMTP** is used for transactional emails.
- **SSE** enables real-time updates to the frontend.

---

## Low-Level Architecture

```mermaid
flowchart TD
  A[User Browser / Frontend]
  B1[Auth Controller]
  B2[Users Controller]
  B3[Flights Controller]
  B4[Bookings Controller]
  B5[SSE Controller]
  B6[Airports Controller]
  S1[Auth Service]
  S2[Users Service]
  S3[Flights Service]
  S4[Bookings Service]
  S5[SSE Service]
  S6[Email Service]
  G1[JWT Auth Guard]
  D1[DTOs & Validators]
  DB[Supabase (Postgres, Auth)]
  EMAIL[SMTP Email Service]

  A-->|REST/SSE|B1
  A-->|REST/SSE|B2
  A-->|REST/SSE|B3
  A-->|REST/SSE|B4
  A-->|REST/SSE|B5
  A-->|REST/SSE|B6
  B1-->|Uses|S1
  B2-->|Uses|S2
  B3-->|Uses|S3
  B4-->|Uses|S4
  B5-->|Uses|S5
  B1-->|Guards|G1
  B2-->|Guards|G1
  B3-->|Guards|G1
  B4-->|Guards|G1
  B2-->|Uses|S6
  B4-->|Uses|S6
  B1-->|DTOs|D1
  B2-->|DTOs|D1
  B3-->|DTOs|D1
  B4-->|DTOs|D1
  B6-->|DTOs|D1
  S1-->|DB/Auth|DB
  S2-->|DB|DB
  S3-->|DB|DB
  S4-->|DB|DB
  S6-->|SMTP|EMAIL
  S5-->|Events|A
```

---

## Module Breakdown

### Controllers
- **Auth Controller**: Handles registration, login, logout, token refresh, and webhooks.
- **Users Controller**: Profile management, password change, booking history.
- **Flights Controller**: Flight search, retrieval, and details.
- **Bookings Controller**: Booking creation, update, cancellation.
- **SSE Controller**: Real-time updates for flights and bookings.
- **Airports Controller**: Airport data and search.

### Services
- **Auth Service**: User authentication, token management.
- **Users Service**: User profile and booking history logic.
- **Flights Service**: Flight search and management.
- **Bookings Service**: Booking logic, seat management, e-ticket generation.
- **SSE Service**: Server-Sent Events for real-time updates.
- **Email Service**: Sending transactional emails.

### Guards
- **JWT Auth Guard**: Protects routes, validates JWT tokens.

### DTOs & Validators
- **DTOs**: Define request/response shapes for all endpoints.
- **Class-Validator**: Ensures data integrity and validation.

---

## Example API Flows

### 1. User Registration
- `POST /api/auth/register` → Auth Controller → Auth Service → Supabase (DB/Auth)

### 2. Flight Search
- `POST /api/flights/search` → Flights Controller → Flights Service → Supabase (DB)

### 3. Booking a Flight
- `POST /api/bookings` → Bookings Controller → Bookings Service → Supabase (DB), Email Service

### 4. Real-time Updates
- `GET /api/sse/connect/:clientId` → SSE Controller → SSE Service → User Browser

---

## Security
- All sensitive endpoints are protected by JWT Auth Guard.
- Data validation is enforced via DTOs and class-validator.
- Environment variables are used for all secrets and configuration.

---

## Extending the System
- Add new controllers/services for new domains.
- Integrate additional providers (e.g., payment gateways) as new services.
- Use DTOs and validators for all new endpoints.

---

## See Also
- [README.md](./README.md) for setup, usage, and API examples. 