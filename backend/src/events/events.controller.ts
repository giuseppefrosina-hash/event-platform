import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() data: any,
    @Request() req,
  ) {
    return this.eventsService.create(
      data,
      req.user.userId,
    );
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req,
  ) {
    return this.eventsService.update(
      Number(id),
      data,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.eventsService.delete(
      Number(id),
      req.user.userId,
    );
  }
}