import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/user/security/auth.guard';
import { ResponseDto } from 'src/util/dto/response.dto';
import { BoardService } from './board.service';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';

@Controller({ path: '/boards', version: ['1'] })
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async createBoard(
    @Req() req: Request,
    @Body() createDto: CreateBoardRequestDto,
  ): Promise<ResponseDto> {
    const user: any = req.user;
    const data = await this.boardService.createBoard(createDto, user);
    return {
      status: 201,
      data,
    };
  }

  @Get()
  @UsePipes(ValidationPipe)
  async getAllBoard(): Promise<ResponseDto> {
    const data = await this.boardService.getAllBoard();
    return {
      status: 200,
      data,
    };
  }
}
