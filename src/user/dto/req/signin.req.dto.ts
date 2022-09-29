import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    type: String,
    example: 'abcd1234@gmail.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'abcd1234<>?',
    description: '비밀번호',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
