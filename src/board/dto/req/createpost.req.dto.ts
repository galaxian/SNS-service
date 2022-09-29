import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBoardRequestDto {
  @ApiProperty({
    type: String,
    example: '제목',
    maxLength: 20,
    description: '게시글 제목',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly title: string;

  @ApiProperty({
    type: String,
    example: '내용',
    maxLength: 200,
    description: '게시글 내용',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly content: string;

  @ApiPropertyOptional({
    type: String,
    example: '#해시태그',
    minLength: 2,
    maxLength: 30,
    description: '해시태그: #태그1,#태그2 형식',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  readonly hashTag?: string;
}
