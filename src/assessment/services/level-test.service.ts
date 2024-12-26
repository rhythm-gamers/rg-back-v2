import { Injectable } from '@nestjs/common';
import { CreateLevelTestDto } from '../dto/create-level-test.dto';
import { UpdateLevelTestDto } from '../dto/update-level-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelTest } from '../entities/level-test.entity';
import { Repository } from 'typeorm';
import { PatternInfo } from 'src/pattern-info/entities/pattern-info.entity';
import { CreatePatternInfoDto } from 'src/pattern-info/dto/create-pattern-info.dto';
import { copyDtoDatasDeleteField } from 'src/common/utils/copy-dto-data';

@Injectable()
export class LevelTestService {
  constructor(
    @InjectRepository(LevelTest)
    private readonly levelTestRepository: Repository<LevelTest>,
  ) {}

  async create(createLevelTestDto: CreateLevelTestDto): Promise<LevelTest> {
    const levelTest: LevelTest = new LevelTest();

    Object.assign(levelTest, {
      ...createLevelTestDto,
      patternInfo: new PatternInfo(),
    });
    Object.assign(levelTest.patternInfo, createLevelTestDto.patternInfo);

    return await this.levelTestRepository.save(levelTest);
  }

  async findAll() {
    return `This action returns all levelTest`;
  }

  async findOne(id: number): Promise<LevelTest> {
    return await this.levelTestRepository.findOne({ where: { id }, relations: ['patternInfo'] });
  }

  async update(id: number, updateLevelTestDto: UpdateLevelTestDto): Promise<LevelTest> {
    const updatePatternInfoData: CreatePatternInfoDto = updateLevelTestDto.patternInfo;
    delete updateLevelTestDto.patternInfo;

    const levelTest: LevelTest = await this.findOne(id);

    Object.assign(levelTest, updateLevelTestDto);
    if (updatePatternInfoData) {
      copyDtoDatasDeleteField(levelTest.patternInfo, updatePatternInfoData);
    }

    return await this.levelTestRepository.save(levelTest);
  }

  async remove(id: number): Promise<void> {
    await this.levelTestRepository.manager.transaction(async manager => {
      const levelTest: LevelTest = await this.findOne(id);
      await manager.remove(PatternInfo, levelTest.patternInfo);
      await manager.remove(LevelTest, levelTest);
    });
  }
}
