import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/user/entity/user.entity';
import { TimeStampableEntity } from 'src/util/entity/timeStamp.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Thumb extends TimeStampableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.thumb, { eager: false })
  user: User;

  @ManyToOne(() => Board, (board) => board.thumb, { eager: false })
  board: Board;

  @Column({ type: 'boolean', default: true })
  isThumb: boolean;
}
