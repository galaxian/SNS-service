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
import { ThumbService } from 'src/thumb/thumb.service';
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
    private readonly thumbService: ThumbService,
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

  async getAllBoard(
    search: string,
    page: number,
    pageSize: number,
    orderBy: string,
    orderOption: string,
  ): Promise<GetAllBoardResponseDto[]> {
    const skip = (page - 1) * pageSize;
    const allBoardList: Board[] = await this.boardRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.hashTag', 'hashTag')
      .innerJoinAndSelect('board.user', 'user')
      .where('board.title like :search', { search: `%${search}%` })
      .orderBy(
        orderOption === 'thumb'
          ? 'board.countThumbUp'
          : orderOption === 'views'
          ? 'board.views'
          : 'board.createAt',
        orderBy === 'ASC' ? 'ASC' : 'DESC',
      )
      .skip(skip)
      .take(pageSize)
      .getMany();

    const result: GetAllBoardResponseDto[] = [];

    allBoardList.forEach((board) => {
      const tagList: string[] = [];
      const tags: HashTag[] = board.hashTag;
      tags.forEach((tag) => {
        tagList.push(tag.tagName);
      });
      result.push({
        id: board.id,
        title: board.title,
        author: board.user.userName,
        tagList,
        countThumb: board.countThumbUp,
        views: board.views,
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

    findBoard.views += 1;

    const saveBoard: Board = await this.boardRepository.save(findBoard);

    return {
      id: saveBoard.id,
      title: saveBoard.title,
      content: saveBoard.content,
      author: saveBoard.user.userName,
      tagList,
      countThumb: saveBoard.countThumbUp,
      views: saveBoard.views,
      createAt: saveBoard.createAt.toString(),
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

  async softDeleteBoard(id: number, user: User): Promise<void> {
    const findBoard: Board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (findBoard.user.id !== user.id) {
      throw new UnauthorizedException('본인 게시글만 삭제 할 수 있습니다.');
    }

    await this.tagService.softDelteTag(id);

    const result = await this.boardRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }
  }

  async restoreBoard(id: number, user: any): Promise<{ id: number }> {
    const findSoftDeleteBoard: Board = await this.boardRepository.findOne({
      where: { id },
      relations: ['user'],
      withDeleted: true,
    });

    if (!findSoftDeleteBoard) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    if (findSoftDeleteBoard.user.id !== user.id) {
      throw new UnauthorizedException('본인의 게시글만 복구할 수 있습니다.');
    }

    const result = await this.boardRepository.restore(id);

    if (!result.affected) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    await this.tagService.restoreTag(id);

    return {
      id: findSoftDeleteBoard.id,
    };
  }

  async thumbUpOrDown(id: number, user: any): Promise<{ isThumb: boolean }> {
    const findBoard: Board = await this.findBoardById(id);

    const isThumb: boolean = await this.thumbService.thumbUpOrDown(
      findBoard,
      user,
    );

    const countThumbUp: number = await this.thumbService.countThumb(
      findBoard.id,
    );

    findBoard.countThumbUp = countThumbUp;

    await this.boardRepository.save(findBoard);

    return {
      isThumb,
    };
  }
}
