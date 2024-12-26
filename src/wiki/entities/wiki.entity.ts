import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateWikiDto } from '../dto/create-wiki.dto';

@Entity()
export class Wiki {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  title: string;

  @Column()
  letter: string;

  @Column({ default: false })
  mustRead: boolean;

  @Column({ default: '', length: 10000 })
  content: string;

  @BeforeInsert()
  @BeforeUpdate()
  setDefaultValues() {
    const unicode = this.title.charCodeAt(0);

    if (0xac00 <= unicode && unicode <= 0xd7a3) {
      const initialIndex = Math.floor((unicode - 0xac00) / 588);
      const initialConsonants = [
        'ㄱ',
        'ㄲ',
        'ㄴ',
        'ㄷ',
        'ㄸ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅃ',
        'ㅅ',
        'ㅆ',
        'ㅇ',
        'ㅈ',
        'ㅉ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ',
      ];
      this.letter = initialConsonants[initialIndex];
    } else {
      this.letter = this.title.charAt(0);
    }
  }

  constructor(dto: CreateWikiDto) {
    this.title = dto?.title || '';
    this.content = dto?.content || '';
    this.mustRead = dto?.mustRead || false;
  }
}
