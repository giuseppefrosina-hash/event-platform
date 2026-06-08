import { Module } from '@nestjs/common';
import { PracticeCostsService } from './practice-costs.service';
import { PracticeCostsController } from './practice-costs.controller';

@Module({
  controllers: [PracticeCostsController],
  providers: [PracticeCostsService],
})
export class PracticeCostsModule {}
