import { Board } from 'src/board/entity/board.entity';
import { TimeStampableEntity } from 'src/util/entity/timeStamp.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HashTag extends TimeStampableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  tagName: string;

  @ManyToOne(() => Board, (board) => board.hashTag, { eager: false })
  board: Board;
}
