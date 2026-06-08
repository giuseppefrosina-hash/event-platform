import { Test, TestingModule } from '@nestjs/testing';
import { PracticeCostsController } from './practice-costs.controller';
import { PracticeCostsService } from './practice-costs.service';

describe('PracticeCostsController', () => {
  let controller: PracticeCostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeCostsController],
      providers: [PracticeCostsService],
    }).compile();

    controller = module.get<PracticeCostsController>(PracticeCostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
