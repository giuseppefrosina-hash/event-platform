import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PracticeCostsService } from './practice-costs.service';
import { CreatePracticeCostDto } from './dto/create-practice-cost.dto';
import { UpdatePracticeCostDto } from './dto/update-practice-cost.dto';

@Controller('practice-costs')
export class PracticeCostsController {
  constructor(private readonly practiceCostsService: PracticeCostsService) {}

  @Post()
  create(@Body() createPracticeCostDto: CreatePracticeCostDto) {
    return this.practiceCostsService.create(createPracticeCostDto);
  }

  @Get()
  findAll() {
    return this.practiceCostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practiceCostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePracticeCostDto: UpdatePracticeCostDto) {
    return this.practiceCostsService.update(+id, updatePracticeCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practiceCostsService.remove(+id);
  }
}
