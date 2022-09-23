import { Thumb } from 'src/thumb/entity/thumb.entity';
import { TimeStampableEntity } from 'src/util/entity/timeStamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
