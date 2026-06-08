import { Test, TestingModule } from '@nestjs/testing';
import { PracticeCostsService } from './practice-costs.service';

describe('PracticeCostsService', () => {
  let service: PracticeCostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PracticeCostsService],
    }).compile();

    service = module.get<PracticeCostsService>(PracticeCostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
