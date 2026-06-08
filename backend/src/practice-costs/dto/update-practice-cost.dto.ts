import { PartialType } from '@nestjs/swagger';
import { CreatePracticeCostDto } from './create-practice-cost.dto';

export class UpdatePracticeCostDto extends PartialType(CreatePracticeCostDto) {}
