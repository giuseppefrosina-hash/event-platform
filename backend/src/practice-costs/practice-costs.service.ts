import { Injectable } from '@nestjs/common';
import { CreatePracticeCostDto } from './dto/create-practice-cost.dto';
import { UpdatePracticeCostDto } from './dto/update-practice-cost.dto';

@Injectable()
export class PracticeCostsService {
  create(createPracticeCostDto: CreatePracticeCostDto) {
    return 'This action adds a new practiceCost';
  }

  findAll() {
    return `This action returns all practiceCosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} practiceCost`;
  }

  update(id: number, updatePracticeCostDto: UpdatePracticeCostDto) {
    return `This action updates a #${id} practiceCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} practiceCost`;
  }
}
