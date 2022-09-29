import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';
import { ThumbModule } from 'src/thumb/thumb.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './entity/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    forwardRef(() => TagModule),
    forwardRef(() => ThumbModule),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
