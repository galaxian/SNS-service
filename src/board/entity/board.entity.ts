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

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  hashTag: string;

  @OneToMany(() => Thumb, (thumb) => thumb.board, { eager: false })
  thumb: Thumb[];

  @ManyToOne(() => User, (user) => user.board, { eager: false })
  user: User;
}
