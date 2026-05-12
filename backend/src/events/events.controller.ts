import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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
    return this.eventsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.eventsService.create(
      body,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.eventsService.update(
      Number(id),
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.eventsService.delete(
      Number(id),
      req.user.userId,
    );
  }
}