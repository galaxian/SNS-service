import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBoardRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly content: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  readonly hashTag?: string;
}
