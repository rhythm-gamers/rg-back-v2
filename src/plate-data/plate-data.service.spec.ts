import { Test, TestingModule } from '@nestjs/testing';
import { PlateDataService } from './plate-data.service';

describe('PlateDataService', () => {
  let service: PlateDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlateDataService],
    }).compile();

    service = module.get<PlateDataService>(PlateDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
