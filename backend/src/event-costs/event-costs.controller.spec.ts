import { Test, TestingModule } from '@nestjs/testing';
import { EventCostsController } from './event-costs.controller';

describe('EventCostsController', () => {
  let controller: EventCostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventCostsController],
    }).compile();

    controller = module.get<EventCostsController>(EventCostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
