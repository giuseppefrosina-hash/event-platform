import { Module } from '@nestjs/common';
import { EventCostsService } from './event-costs.service';
import { EventCostsController } from './event-costs.controller';

@Module({
  providers: [EventCostsService],
  controllers: [EventCostsController]
})
export class EventCostsModule {}
