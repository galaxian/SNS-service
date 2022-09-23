import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseDto } from 'src/util/dto/response.dto';
import { SignUpRequestDto } from './dto/signupreq.dto';
import { SignUpResposneDto } from './dto/signupres.dto';
import { UserService } from './user.service';

@Controller({ path: '/users', version: ['1'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDto: SignUpRequestDto): Promise<ResponseDto> {
    const data: SignUpResposneDto = await this.userService.signUp(signUpDto);
    return {
      data,
      status: 201,
      msg: '회원가입에 성공하셨습니다.',
    };
  }
}
