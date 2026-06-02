import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { EventCostsService } from './event-costs.service';

@Controller('event-costs')
export class EventCostsController {
  constructor(
    private readonly eventCostsService: EventCostsService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.eventCostsService.create(body);
  }

  @Get()
  findAll() {
    return this.eventCostsService.findAll();
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventCostsService.findByEvent(eventId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventCostsService.remove(id);
  }
}