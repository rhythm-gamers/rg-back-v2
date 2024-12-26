import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlateDataService } from './plate-data.service';
import { CreatePlateDatumDto } from './dto/create-plate-datum.dto';
import { UpdatePlateDatumDto } from './dto/update-plate-datum.dto';

@Controller('plate-data')
export class PlateDataController {
  constructor(private readonly plateDataService: PlateDataService) {}

  @Post()
  create(@Body() createPlateDatumDto: CreatePlateDatumDto) {
    return this.plateDataService.create(createPlateDatumDto);
  }

  @Get()
  findAll() {
    return this.plateDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plateDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlateDatumDto: UpdatePlateDatumDto) {
    return this.plateDataService.update(+id, updatePlateDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plateDataService.remove(+id);
  }
}
