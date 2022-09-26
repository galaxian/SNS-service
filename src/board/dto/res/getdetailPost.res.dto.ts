import { GetAllBoardResponseDto } from './getpost.res.dto';

export class GetDetailBoardResponseDto extends GetAllBoardResponseDto {
  content: string;
}
