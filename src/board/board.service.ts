import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTag } from 'src/tag/entity/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';
import { GetDetailBoardResponseDto } from './dto/res/getdetailPost.res.dto';
import { GetAllBoardResponseDto } from './dto/res/getpost.res.dto';
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

  async getAllBoard(): Promise<GetAllBoardResponseDto[]> {
    const allBoardList: Board[] = await this.boardRepository.find({
      relations: ['user', 'hashTag'],
    });

    const result: GetAllBoardResponseDto[] = [];

    allBoardList.forEach((board) => {
      const tagList: string[] = [];
      const tags: HashTag[] = board.hashTag;
      tags.forEach((tag) => {
        tagList.push(tag.tagName);
      });
      result.push({
        title: board.title,
        author: board.user.userName,
        tagList,
        createAt: board.createAt.toString(),
      });
    });

    return result;
  }

  async getDetailBoard(id: number): Promise<GetDetailBoardResponseDto> {
    const findBoard: Board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user', 'hashTag'],
    });

    const tagList: string[] = [];
    const tags: HashTag[] = findBoard.hashTag;
    tags.forEach((tag) => {
      tagList.push(tag.tagName);
    });

    return {
      title: findBoard.title,
      content: findBoard.content,
      author: findBoard.user.userName,
      tagList,
      createAt: findBoard.createAt.toString(),
    };
  }

  async updateBoard(
    id: number,
    updateDto: CreateBoardRequestDto,
    user: User,
  ): Promise<{ id: number }> {
    const findBoard: Board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user', 'hashTag'],
    });

    if (!findBoard) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    if (findBoard.user.id !== user.id) {
      throw new UnauthorizedException('본인 게시글만 수정 할 수 있습니다.');
    }

    const { title, content, hashTag } = updateDto;

    await this.tagService.updateTag(id, hashTag);

    findBoard.content = content;
    findBoard.title = title;

    const updateBoard: Board = await this.boardRepository.save(findBoard);

    return {
      id: updateBoard.id,
    };
  }
}
