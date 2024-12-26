import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { UpsertBoardDto } from './dto/upsert-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async upsert(upsertBoardDto: CreateBoardDto | UpdateBoardDto, originTitle?: string) {
    const board: Board = originTitle
      ? await this.boardRepository.findOne({
          where: {
            title: originTitle,
          },
        })
      : new Board();

    Object.assign(board, upsertBoardDto);
    return await this.boardRepository.save(board);
  }

  findAll() {
    return `This action returns all board`;
  }

  async findOne(title: string) {
    return await this.boardRepository.findOneOrFail({
      where: {
        title,
      },
    });
  }

  async remove(title: string) {
    const board = await this.boardRepository.findOneOrFail({
      where: {
        title,
      },
    });
    await this.boardRepository.remove(board);
  }
}
