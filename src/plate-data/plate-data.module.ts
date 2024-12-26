import { Module } from '@nestjs/common';
import { PlateDataService } from './plate-data.service';
import { PlateDataController } from './plate-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlateData } from './entities/plate-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlateData])],
  controllers: [PlateDataController],
  providers: [PlateDataService],
})
export class PlateDataModule {}
