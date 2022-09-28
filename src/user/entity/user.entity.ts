import { Board } from 'src/board/entity/board.entity';
import { Thumb } from 'src/thumb/entity/thumb.entity';
import { TimeStampableEntity } from 'src/util/entity/timeStamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends TimeStampableEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany(() => Thumb, (thumb) => thumb.user, { eager: false })
  thumb: Thumb[];

  @OneToMany(() => Board, (board) => board.user, { eager: false })
  board: Board;
}
