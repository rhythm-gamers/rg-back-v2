import { Module } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { WikiController } from './wiki.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wiki } from './entities/wiki.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wiki])],
  controllers: [WikiController],
  providers: [WikiService],
})
export class WikiModule {}
