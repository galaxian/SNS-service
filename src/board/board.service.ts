import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';
import { Board } from './entity/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async createBoard(
    createDto: CreateBoardRequestDto,
    user: User,
  ): Promise<{ id: number }> {
    const board: Board = this.boardRepository.create({
      title: createDto.title,
      content: createDto.content,
      user,
    });

    const saveBoard: Board = await this.boardRepository.save(board);

    return { id: saveBoard.id };
  }
}
