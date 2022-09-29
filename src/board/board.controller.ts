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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/user/security/auth.guard';
import { ResponseDto } from 'src/util/dto/response.dto';
import { BoardService } from './board.service';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';
import { GetDetailBoardResponseDto } from './dto/res/getdetailPost.res.dto';
import { GetAllBoardResponseDto } from './dto/res/getpost.res.dto';

@ApiTags('게시글 관련 api')
@Controller({ path: '/boards', version: ['1'] })
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시글 작성 api',
    description: '인증된 사용자에 한해 게시글을 작성할 수 있는 api',
  })
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: '게시글 목록 조회 api',
    description:
      '정렬, 페이징, 검색 기능을 포함하여 게시글 목록을 조회 하는 api',
  })
  @Get()
  @UsePipes(ValidationPipe)
  async getAllBoard(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pagesize', new DefaultValuePipe(10)) pageSize: number,
    @Query('orderby', new DefaultValuePipe('DESC')) orderBy: string,
    @Query('option', new DefaultValuePipe('createAt')) orderOption: string,
  ): Promise<ResponseDto> {
    const data: GetAllBoardResponseDto[] = await this.boardService.getAllBoard(
      search,
      page,
      pageSize,
      orderBy,
      orderOption,
    );
    return {
      status: 200,
      data,
    };
  }

  @ApiOperation({
    summary: '게시글 상세 조회 api',
    description: '게시글 pk를 사용하여 게시글을 상세 조회 하는 api',
  })
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

  @ApiOperation({
    summary: '게시글 수정 api',
    description: '본인의 게시글인지 확인 후 게시글을 수정하는 api',
  })
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: '게시글 삭제 api',
    description: '본인의 게시글인지 확인 후 게시글을 삭제하는 api',
  })
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: '게시글 복구 api',
    description: '본인의 게시글인지 확인 후 삭제한 게시글을 복구하는 api',
  })
  @ApiBearerAuth('access-token')
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

  @ApiOperation({
    summary: '게시글 좋아요 api',
    description: '게시글에 좋아요 또는 좋아요 취소 기능을 하는 api',
  })
  @ApiBearerAuth('access-token')
  @Put('/:id/thumbs')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async thumbUpOrDown(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    const user: any = req.user;
    const data = await this.boardService.thumbUpOrDown(id, user);
    return {
      status: 200,
      data,
    };
  }
}
