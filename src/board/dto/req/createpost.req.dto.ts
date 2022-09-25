import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  hashTag?: string;
}
