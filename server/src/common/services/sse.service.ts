import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SseService {
  private clients: Map<string, any> = new Map();

  constructor(private eventEmitter: EventEmitter2) {}

  addClient(clientId: string, response: any) {
    this.clients.set(clientId, response);
    
    // Set headers for SSE
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // Send initial connection message
    response.write(`data: ${JSON.stringify({ type: 'connection', message: 'Connected to SSE' })}\n\n`);

    // Handle client disconnect
    response.on('close', () => {
      this.clients.delete(clientId);
    });
  }

  sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  broadcastToAll(data: any) {
    this.clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }

  sendFlightUpdate(flightId: string, update: any) {
    const data = {
      type: 'flight_update',
      flightId,
      update,
      timestamp: new Date().toISOString(),
    };
    this.broadcastToAll(data);
  }

  sendBookingUpdate(bookingId: string, update: any) {
    const data = {
      type: 'booking_update',
      bookingId,
      update,
      timestamp: new Date().toISOString(),
    };
    this.broadcastToAll(data);
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }
} 