import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseDto } from 'src/util/dto/response.dto';
import { SignInRequestDto } from './dto/req/signin.req.dto';
import { SignUpRequestDto } from './dto/req/signupreq.dto';
import { SignUpResposneDto } from './dto/res/signupres.dto';
import { UserService } from './user.service';

@ApiTags('사용자 관련 api')
@Controller({ path: '/users', version: ['1'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입 api',
    description: 'email과 닉네임, 비밀번호를 사용하여 회원가입을 진행하는 api',
  })
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

  @ApiOperation({
    summary: '로그인 api',
    description:
      'email과 비밀번호를 사용하여 로그인 진행 후 access token을 발급하는 api',
  })
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
