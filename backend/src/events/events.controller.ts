import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.eventsService.create(
      body,
      req.user.userId,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(
      Number(id),
    );
  }
}