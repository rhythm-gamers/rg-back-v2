import { Test, TestingModule } from '@nestjs/testing';
import { PlateDataController } from './plate-data.controller';
import { PlateDataService } from './plate-data.service';

describe('PlateDataController', () => {
  let controller: PlateDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlateDataController],
      providers: [PlateDataService],
    }).compile();

    controller = module.get<PlateDataController>(PlateDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
