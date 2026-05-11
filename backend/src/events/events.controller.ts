import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.eventsService.findOne(
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.eventsService.create(
      body,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.eventsService.delete(
      Number(id),
      req.user.id,
    );
  }
}