import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    type: Number,
    description: '상태코드',
  })
  status: number;

  @ApiPropertyOptional({
    type: Object,
    description: '서비스 layer에서 반환한 데이터',
  })
  data?: any;

  @ApiPropertyOptional({
    type: String,
    description: '프론트엔드에 전달할 메시지',
  })
  msg?: string;
}
