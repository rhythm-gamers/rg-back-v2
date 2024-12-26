import { Injectable } from '@nestjs/common';
import { CreatePatternPracticeDto } from '../dto/create-pattern-practice.dto';
import { UpdatePatternPracticeDto } from '../dto/update-pattern-practice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatternPractice } from '../entities/pattern-practice.entity';
import { Repository } from 'typeorm';
import { PatternInfo } from 'src/pattern-info/entities/pattern-info.entity';
import { CreatePatternInfoDto } from 'src/pattern-info/dto/create-pattern-info.dto';
import { copyDtoDatasDeleteField } from 'src/common/utils/copy-dto-data';

@Injectable()
export class PatternPracticeService {
  constructor(
    @InjectRepository(PatternPractice)
    private readonly patternPracticeRepository: Repository<PatternPractice>,
  ) {}

  async create(createPatternPracticeDto: CreatePatternPracticeDto) {
    const patternPractice: PatternPractice = new PatternPractice();

    Object.assign(patternPractice, {
      ...createPatternPracticeDto,
      patternInfo: new PatternInfo(),
    });
    Object.assign(patternPractice.patternInfo, createPatternPracticeDto.patternInfo);

    return await this.patternPracticeRepository.save(patternPractice);
  }

  findAll() {
    return `This action returns all patternPractice`;
  }

  async findOne(id: number): Promise<PatternPractice> {
    return await this.patternPracticeRepository.findOne({ where: { id }, relations: ['patternInfo'] });
  }

  async update(id: number, updatePatternPracticeDto: UpdatePatternPracticeDto) {
    const updatePatternInfoData: CreatePatternInfoDto = updatePatternPracticeDto.patternInfo;
    delete updatePatternPracticeDto.patternInfo;

    const patternPractice: PatternPractice = await this.findOne(id);

    Object.assign(patternPractice, updatePatternPracticeDto);
    if (updatePatternInfoData) {
      copyDtoDatasDeleteField(patternPractice.patternInfo, updatePatternInfoData);
    }

    return await this.patternPracticeRepository.save(patternPractice);
  }

  async remove(id: number): Promise<void> {
    await this.patternPracticeRepository.manager.transaction(async manager => {
      const patternPractice: PatternPractice = await this.findOne(id);
      await manager.remove(PatternInfo, patternPractice.patternInfo);
      await manager.remove(PatternPractice, patternPractice);
    });
  }
}
