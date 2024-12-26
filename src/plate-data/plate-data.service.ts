import { Injectable } from '@nestjs/common';
import { CreatePlateDatumDto } from './dto/create-plate-datum.dto';
import { UpdatePlateDatumDto } from './dto/update-plate-datum.dto';

@Injectable()
export class PlateDataService {
  create(createPlateDatumDto: CreatePlateDatumDto) {
    return 'This action adds a new plateDatum';
  }

  findAll() {
    return `This action returns all plateData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plateDatum`;
  }

  update(id: number, updatePlateDatumDto: UpdatePlateDatumDto) {
    return `This action updates a #${id} plateDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} plateDatum`;
  }
}
