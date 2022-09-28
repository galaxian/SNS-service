import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    type: String,
    example: 'abcd1234@gmail.com',
    description: '사용자 이메일',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
  )
  readonly email: string;

  @ApiProperty({
    type: String,
    example: 'galaxian',
    maxLength: 10,
    description: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly userName: string;

  @ApiProperty({
    type: String,
    example: 'abcd1234<>?',
    minLength: 10,
    maxLength: 15,
    description: '비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^.*(?=^.{10,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
  readonly password: string;

  @ApiProperty({
    type: String,
    example: 'abcd1234<>?',
    minLength: 10,
    maxLength: 15,
    description: '비밀번호 체크',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^.*(?=^.{10,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
  readonly checkPassword: string;
}
