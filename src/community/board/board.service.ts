import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(craeteBoardDto: CreateBoardDto) {
    const board: Board = this.boardRepository.create({ ...craeteBoardDto });
    await this.boardRepository.save(board);
  }

  async update(originTitle: string, updateBoardDto: UpdateBoardDto) {
    const boardExists: Board = await this.boardRepository.findOneBy({ title: originTitle });
    if (!boardExists) throw new BadRequestException(`board "${originTitle}" not found`);

    Object.assign(boardExists, updateBoardDto);
    await this.boardRepository.save(boardExists);
  }

  async fetchPagenatedBoards(page: number, take: number): Promise<Board[]> {
    return await this.boardRepository.find({
      skip: (page - 1) * take,
      take,
    });
  }

  async findOne(title: string): Promise<Board> {
    const result: Board = await this.boardRepository.findOneBy({ title });
    if (!result) throw new BadRequestException(`board "${title}" not found`);
    return result;
  }

  async remove(title: string): Promise<void> {
    const board = await this.boardRepository.findOneBy({ title });
    if (!board) throw new BadRequestException(`board "${title}" not found`);
    await this.boardRepository.softRemove(board);
  }
}
