import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from 'src/util/dto/response.dto';
import { SignInRequestDto } from './dto/req/signin.req.dto';
import { SignUpRequestDto } from './dto/req/signupreq.dto';
import { SignUpResposneDto } from './dto/res/signupres.dto';
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

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() signInDto: SignInRequestDto,
    @Res() res: Response,
  ): Promise<any> {
    const jwt = await this.userService.signIn(signInDto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }
}
