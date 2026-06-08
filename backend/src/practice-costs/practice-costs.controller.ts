import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PracticeCostsService } from './practice-costs.service';

@Controller('practice-costs')
export class PracticeCostsController {
  constructor(
    private readonly practiceCostsService: PracticeCostsService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.practiceCostsService.create(body);
  }

  @Get()
  findAll() {
    return this.practiceCostsService.findAll();
  }

  @Get('practice/:practiceId')
  findByPractice(
    @Param('practiceId') practiceId: string,
  ) {
    return this.practiceCostsService.findByPractice(
      practiceId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.practiceCostsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practiceCostsService.remove(id);
  }
}