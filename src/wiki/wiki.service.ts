import { Injectable } from '@nestjs/common';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from './entities/wiki.entity';
import { Like, Repository } from 'typeorm';
import { FetchWikiDto } from './dto/fetch-wiki.dto';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki)
    private readonly wikiRepository: Repository<Wiki>,
  ) {}

  async create(createWikiDto: CreateWikiDto) {
    const newWiki = new Wiki(createWikiDto);
    await this.wikiRepository.save(newWiki);
  }

  async findAll(): Promise<Wiki[]> {
    const wikis: Wiki[] = await this.wikiRepository.find();
    return wikis;
  }

  async findOne(title: string) {
    const wiki: Wiki = await this.wikiRepository.findOne({
      where: {
        title: title,
      },
    });
    return wiki;
  }

  async update(originTitle: string, updateWikiDto: UpdateWikiDto) {
    const wiki = await this.wikiRepository.findOneBy({ title: originTitle });
    if (!wiki) throw new Error('존재하지 않습니다.');
    Object.assign(wiki, updateWikiDto);
    await this.wikiRepository.save(wiki);
  }

  async remove(title: string) {
    await this.wikiRepository.delete({ title: title });
  }

  async search(term: string): Promise<FetchWikiDto[]> {
    const wikis: Wiki[] = await this.wikiRepository.findBy({ title: Like(`%${term}%`) });
    const response: FetchWikiDto[] = wikis.map(wiki => {
      const { id, ...datas } = wiki;
      return datas;
    });
    return response;
  }
}
