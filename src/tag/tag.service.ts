import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardService } from 'src/board/board.service';
import { Repository } from 'typeorm';
import { HashTag } from './entity/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(HashTag)
    private readonly tagRepository: Repository<HashTag>,
    @Inject(forwardRef(() => BoardService))
    private readonly boardService: BoardService,
  ) {}

  async saveTag(boardId: number, tagStrings: string): Promise<void> {
    const tagList = tagStrings.replace(/#/g, '').split(',');
    const findBoard = await this.boardService.findBoardById(boardId);

    tagList.forEach(async (tag) => {
      const hashTag = this.tagRepository.create({
        tagName: tag,
        board: findBoard,
      });
      await this.tagRepository.save(hashTag);
    });
  }
}
