import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
  )
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly userName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^.*(?=^.{10,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^.*(?=^.{10,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
  readonly checkPassword: string;
}
