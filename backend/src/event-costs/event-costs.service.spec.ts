import { Test, TestingModule } from '@nestjs/testing';
import { EventCostsService } from './event-costs.service';

describe('EventCostsService', () => {
  let service: EventCostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventCostsService],
    }).compile();

    service = module.get<EventCostsService>(EventCostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
