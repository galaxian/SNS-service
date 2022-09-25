import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTag } from './entity/tag.entity';

@Module({ imports: [TypeOrmModule.forFeature([HashTag])] })
export class TagModule {}
