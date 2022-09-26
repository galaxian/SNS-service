import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Thumb } from './entity/thumb.entity';

@Injectable()
export class ThumbService {
  constructor(
    @InjectRepository(Thumb)
    private readonly thumbRepository: Repository<Thumb>,
  ) {}

  async thumbUpOrDown(board: Board, user: User): Promise<boolean> {
    const thumb: Thumb = await this.thumbRepository.findOne({
      where: { board: { id: board.id }, user: { id: user.id } },
    });

    if (!thumb) {
      return await this.createThumb(board, user);
    }

    return await this.thumbChange(thumb);
  }

  async createThumb(board: Board, user: User): Promise<boolean> {
    const thumb: Thumb = this.thumbRepository.create({ board, user });
    const saveThumb = await this.thumbRepository.save(thumb);
    return saveThumb.isThumb;
  }

  async thumbChange(thumb: Thumb): Promise<boolean> {
    thumb.isThumb = !thumb.isThumb;
    await this.thumbRepository.save(thumb);
    return thumb.isThumb;
  }

  async countThumb(id: number): Promise<number> {
    return await this.thumbRepository.countBy({ board: { id }, isThumb: true });
  }
}
