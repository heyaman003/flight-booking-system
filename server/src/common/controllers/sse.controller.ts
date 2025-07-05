import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { SseService } from '../services/sse.service';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Get('connect/:clientId')
  async connect(@Param('clientId') clientId: string, @Res() res: Response) {
    this.sseService.addClient(clientId, res);
  }

  @Get('status')
  getStatus() {
    return {
      connectedClients: this.sseService.getConnectedClientsCount(),
    };
  }
} 