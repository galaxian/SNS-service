import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { GetDetailBoardResponseDto } from './dto/res/getdetailPost.res.dto';
import { GetAllBoardResponseDto } from './dto/res/getpost.res.dto';

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
  async getAllBoard(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pagesize', new DefaultValuePipe(10)) pageSize: number,
  ): Promise<ResponseDto> {
    const data: GetAllBoardResponseDto[] = await this.boardService.getAllBoard(
      search,
      page,
      pageSize,
    );
    return {
      status: 200,
      data,
    };
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async getDetailBoard(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    const data: GetDetailBoardResponseDto =
      await this.boardService.getDetailBoard(id);
    return {
      status: 200,
      data,
    };
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: CreateBoardRequestDto,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    const data = await this.boardService.updateBoard(id, updateDto, user);
    return {
      status: 200,
      data,
    };
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async softDeleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    const user: any = req.user;
    await this.boardService.softDeleteBoard(id, user);
    return {
      status: 200,
    };
  }

  @Put('/restore/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async restoreBoard(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    const user: any = req.user;
    const data = await this.boardService.restoreBoard(id, user);
    return {
      status: 200,
      data,
    };
  }
}
