import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    private eventsService: EventsService,
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
    @Req() req: any,
  ) {
    console.log(
      'REQUEST USER:',
      req.user,
    );

    return this.eventsService.create(
      body,
      req.user.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(
      Number(id),
    );
  }
}