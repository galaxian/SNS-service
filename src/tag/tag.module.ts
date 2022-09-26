import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from 'src/board/board.module';
import { HashTag } from './entity/tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTag]), forwardRef(() => BoardModule)],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
