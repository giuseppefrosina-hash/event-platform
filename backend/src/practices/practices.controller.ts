import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PracticesService } from './practices.service';

@Controller('practices')
export class PracticesController {
  constructor(
    private readonly practicesService: PracticesService,
  ) {}

  @Get()
  findAll() {
    return this.practicesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.practicesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.practicesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practicesService.remove(id);
  }
}