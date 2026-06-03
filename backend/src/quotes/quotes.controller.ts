import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.quotesService.create(body);
  }

  @Post('generate')
  generate(
    @Body()
    body: {
      eventId: string;
      markup: number;
    },
  ) {
    return this.quotesService.generateFromEvent(
      body.eventId,
      Number(body.markup || 0),
    );
  }

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Get('event/:eventId')
  findByEvent(
    @Param('eventId') eventId: string,
  ) {
    return this.quotesService.findByEvent(eventId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.quotesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotesService.remove(id);
  }
}