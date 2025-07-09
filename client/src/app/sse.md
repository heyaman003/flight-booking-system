# Server-Sent Events (SSE) Usage Guide

## Overview
This app uses Server-Sent Events (SSE) to receive real-time updates from the backend for things like flight and booking changes.

## How It Works
- The backend exposes `/sse/connect/:clientId` for SSE connections.
- The frontend connects using a unique `clientId` (such as the user's ID).
- Events are sent from the backend and received in the frontend via the `useSSE` hook.

## Using the `useSSE` Hook

```
import { useSSE } from '@/hooks/useSSE';
import { toast } from 'sonner';

function SSEListener({ clientId }) {
  useSSE(clientId, (event) => {
    if (event.type === 'flight_update') {
      toast.info(`Flight ${event.flightId} updated: ${JSON.stringify(event.update)}`);
    }
    if (event.type === 'booking_update') {
      toast.info(`Booking ${event.bookingId} updated: ${JSON.stringify(event.update)}`);
    }
  });
  return null;
}
```

- Place `<SSEListener clientId={userId} />` in your app (e.g., in your layout or main page).
- The hook will automatically connect/disconnect as needed.

## Event Types
- `flight_update`: `{ type, flightId, update, timestamp }`
- `booking_update`: `{ type, bookingId, update, timestamp }`
- `connection`: `{ type: 'connection', message: 'Connected to SSE' }`

## Tips
- Use a unique `clientId` for each user/session.
- Handle events in the callback to update UI or show notifications.
- SSE is one-way (server → client). For client → server, use normal HTTP APIs.

--- 