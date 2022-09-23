import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
