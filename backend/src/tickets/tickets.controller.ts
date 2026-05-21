import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.ticketsService.create(body);
  }

  @Patch('checkin/:qrCode')
  checkIn(
    @Param('qrCode') qrCode: string,
  ) {
    return this.ticketsService.checkIn(qrCode);
  }
}