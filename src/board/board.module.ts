import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './entity/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), forwardRef(() => TagModule)],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
