import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';
import { Board } from './entity/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
  ) {}

  async createBoard(
    createDto: CreateBoardRequestDto,
    user: User,
  ): Promise<{ id: number }> {
    const { title, content, hashTag } = createDto;

    const board: Board = this.boardRepository.create({
      title,
      content,
      user,
    });

    const saveBoard: Board = await this.boardRepository.save(board);

    await this.tagService.saveTag(saveBoard.id, hashTag);

    return { id: saveBoard.id };
  }

  async findBoardById(boardId: number): Promise<Board> {
    const findBoard: Board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!findBoard) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    return findBoard;
  }
}
