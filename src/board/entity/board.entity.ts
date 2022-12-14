import { HashTag } from 'src/tag/entity/tag.entity';
import { Thumb } from 'src/thumb/entity/thumb.entity';
import { User } from 'src/user/entity/user.entity';
import { TimeStampableEntity } from 'src/util/entity/timeStamp.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Board extends TimeStampableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 25 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  content: string;

  @Column({ type: 'int', default: 0 })
  countThumbUp: number;

  @Column({ type: 'int', default: 0 })
  views: number;

  @OneToMany(() => Thumb, (thumb) => thumb.board, { eager: false })
  thumb: Thumb[];

  @ManyToOne(() => User, (user) => user.board, { eager: false })
  user: User;

  @OneToMany(() => HashTag, (hashTag) => hashTag.board, { eager: false })
  hashTag: HashTag[];
}
