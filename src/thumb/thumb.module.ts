import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thumb } from './entity/thumb.entity';
import { ThumbService } from './thumb.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thumb])],
  providers: [ThumbService],
  exports: [ThumbService],
})
export class ThumbModule {}
