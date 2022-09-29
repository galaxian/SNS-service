import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagService } from 'src/tag/tag.service';
import { ThumbService } from 'src/thumb/thumb.service';
import { User } from 'src/user/entity/user.entity';
import { BoardService } from './board.service';
import { CreateBoardRequestDto } from './dto/req/createpost.req.dto';
import { GetDetailBoardResponseDto } from './dto/res/getdetailPost.res.dto';
import { Board } from './entity/board.entity';

describe('BoardService', () => {
  let boardService: BoardService;

  const mockBoardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  const mockTagService = {
    saveTag: jest.fn(),
    updateTag: jest.fn(),
    softDeleteTag: jest.fn(),
    restoreTag: jest.fn(),
  };

  const mockThumbService = {
    thumbUpOrDown: jest.fn(),
    countThumb: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        { provide: getRepositoryToken(Board), useValue: mockBoardRepository },
        { provide: TagService, useValue: mockTagService },
        { provide: ThumbService, useValue: mockThumbService },
      ],
    }).compile();

    boardService = module.get<BoardService>(BoardService);
    mockBoardRepository.save.mockClear();
    mockBoardRepository.create.mockClear();
    mockBoardRepository.findOne.mockClear();
    mockBoardRepository.restore.mockClear();
    mockBoardRepository.softDelete.mockClear();
    mockTagService.saveTag.mockClear();
    mockTagService.updateTag.mockClear();
    mockTagService.softDeleteTag.mockClear();
    mockThumbService.countThumb.mockClear();
    mockThumbService.thumbUpOrDown.mockClear();
  });

  it('should be defined', () => {
    expect(boardService).toBeDefined();
  });

  describe('createBoard', () => {
    it('게시글 작성 성공', async () => {
      //given
      const inputDto: CreateBoardRequestDto = {
        title: '제목',
        content: '내용',
        hashTag: '#해시,#태그',
      };

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const createBoard: Board = {
        id: undefined,
        title: inputDto.title,
        content: inputDto.content,
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveBoard: Board = {
        id: 1,
        title: inputDto.title,
        content: inputDto.content,
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.create.mockReturnValue(createBoard);
      mockBoardRepository.save.mockReturnValue(saveBoard);
      mockTagService.saveTag.mockReturnValue(undefined);

      //when
      const result = await boardService.createBoard(inputDto, user);

      //then
      expect(result.id).toEqual(saveBoard.id);
      expect(mockBoardRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.create).toHaveBeenCalledWith({
        title: inputDto.title,
        content: inputDto.content,
        user,
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(createBoard);
      expect(mockTagService.saveTag).toHaveBeenCalledTimes(1);
      expect(mockTagService.saveTag).toHaveBeenCalledWith(
        saveBoard.id,
        inputDto.hashTag,
      );
    });
    it('해시태그 없을 시 게시글 작성 성공', async () => {
      //given
      const inputDto: CreateBoardRequestDto = {
        title: '제목',
        content: '내용',
      };

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const createBoard: Board = {
        id: undefined,
        title: inputDto.title,
        content: inputDto.content,
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveBoard: Board = {
        id: 1,
        title: inputDto.title,
        content: inputDto.content,
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.create.mockReturnValue(createBoard);
      mockBoardRepository.save.mockReturnValue(saveBoard);
      mockTagService.saveTag.mockReturnValue(undefined);

      //when
      const result = await boardService.createBoard(inputDto, user);

      //then
      expect(result.id).toEqual(saveBoard.id);
      expect(mockBoardRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.create).toHaveBeenCalledWith({
        title: inputDto.title,
        content: inputDto.content,
        user,
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(createBoard);
      expect(mockTagService.saveTag).toHaveBeenCalledTimes(0);
    });
  });

  describe('getDetailBoard', () => {
    it('게시글 상세 조회 성공', async () => {
      //given
      const boardId = 1;

      const now = new Date();

      const findBoard: Board = {
        id: boardId,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: new User(),
        hashTag: [],
        createAt: now,
        updateAt: now,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(findBoard);
      mockBoardRepository.save.mockResolvedValue(findBoard);

      //when
      const result: GetDetailBoardResponseDto =
        await boardService.getDetailBoard(boardId);

      //then
      expect(result.id).toEqual(boardId);
      expect(result.createAt).toEqual(now.toString());
      expect(result.views).toEqual(findBoard.views);
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user', 'hashTag'],
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(findBoard);
    });
    it('게시글 없음', async () => {
      //given
      const boardId = 1;

      mockBoardRepository.findOne.mockReturnValue(null);

      //when

      //then
      expect(async () => {
        await boardService.getDetailBoard(boardId);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시글입니다.'),
      );
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user', 'hashTag'],
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('updateBoard', () => {
    it('게시글 수정 성공', async () => {
      //given
      const boardId = 1;
      const updateDto: CreateBoardRequestDto = {
        title: '제목 수정',
        content: '내용 수정',
      };
      const create = new Date();

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: 1,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: create,
        updateAt: create,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(findBoard);
      mockBoardRepository.save.mockReturnValue(findBoard);
      mockTagService.updateTag.mockReturnValue(undefined);

      //when
      const result = await boardService.updateBoard(boardId, updateDto, user);

      //then
      expect(result.id).toEqual(boardId);
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user', 'hashTag'],
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(findBoard);
      expect(mockTagService.updateTag).toHaveBeenCalledTimes(1);
      expect(mockTagService.updateTag).toHaveBeenCalledWith(
        boardId,
        updateDto.hashTag,
      );
    });
    it('게시글 NotFound', async () => {
      //given
      const boardId = 1;
      const updateDto: CreateBoardRequestDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(null);

      //when

      //then
      expect(async () => {
        await boardService.updateBoard(boardId, updateDto, user);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시글입니다.'),
      );
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user', 'hashTag'],
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(0);
      expect(mockTagService.updateTag).toHaveBeenCalledTimes(0);
    });
    it('타인 게시글 수정 실패', async () => {
      //given
      const boardId = 1;
      const now = new Date();
      const updateDto: CreateBoardRequestDto = {
        title: '제목 수정',
        content: '내용 수정',
      };

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const anotherUser: User = {
        id: 2,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: boardId,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: anotherUser,
        hashTag: [],
        createAt: now,
        updateAt: now,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(findBoard);

      //when

      //then
      expect(async () => {
        await boardService.updateBoard(boardId, updateDto, user);
      }).rejects.toThrowError(
        new UnauthorizedException('본인 게시글만 수정 할 수 있습니다.'),
      );
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user', 'hashTag'],
      });
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(0);
      expect(mockTagService.updateTag).toHaveBeenCalledTimes(0);
    });
  });

  describe('softDeleteBoard', () => {
    it('게시글 softDelete 성공', async () => {
      //given
      const boardId = 1;

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: 1,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(findBoard);
      mockBoardRepository.softDelete.mockReturnValue({ affected: 1 });
      mockTagService.softDeleteTag.mockReturnValue(undefined);

      //when
      const result = await boardService.softDeleteBoard(boardId, user);

      //then
      expect(result).toBeUndefined();
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user'],
      });
      expect(mockTagService.softDeleteTag).toHaveBeenCalledTimes(1);
      expect(mockTagService.softDeleteTag).toHaveBeenCalledWith(boardId);
      expect(mockBoardRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.softDelete).toHaveBeenCalledWith(boardId);
    });
    it('게시글 notFound', async () => {
      //given
      const boardId = 1;

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(null);

      //when

      //then
      expect(async () => {
        await boardService.softDeleteBoard(boardId, user);
      }).rejects.toThrowError(
        new NotFoundException('게시글이 존재하지 않습니다.'),
      );
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user'],
      });
      expect(mockTagService.softDeleteTag).toHaveBeenCalledTimes(0);
      expect(mockBoardRepository.softDelete).toHaveBeenCalledTimes(0);
    });
    it('타인 게시글 삭제 실패', async () => {
      //given
      const boardId = 1;

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const anotherUser: User = {
        id: 2,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: 1,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: anotherUser,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardRepository.findOne.mockReturnValue(findBoard);

      //when

      //then
      expect(async () => {
        await boardService.softDeleteBoard(boardId, user);
      }).rejects.toThrowError(
        new UnauthorizedException('본인 게시글만 삭제 할 수 있습니다.'),
      );
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user'],
      });
      expect(mockTagService.softDeleteTag).toHaveBeenCalledTimes(0);
      expect(mockBoardRepository.softDelete).toHaveBeenCalledTimes(0);
    });
  });

  describe('restoreBoard', () => {
    it('게시글 복구 성공', async () => {
      //given
      const boardId = 1;

      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: 1,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: user,
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: new Date(),
      };

      const restoreBoard: Board = findBoard;
      restoreBoard.deleteAt = null;

      mockBoardRepository.findOne.mockReturnValue(findBoard);
      mockBoardRepository.restore.mockReturnValue({ affected: 1 });
      mockTagService.restoreTag.mockReturnValue(undefined);

      //when
      const result = await boardService.restoreBoard(boardId, user);

      //then
      expect(result.id).toEqual(boardId);
      expect(mockBoardRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
        relations: ['user'],
        withDeleted: true,
      });
      expect(mockBoardRepository.restore).toHaveBeenCalledTimes(1);
      expect(mockBoardRepository.restore).toHaveBeenCalledWith(boardId);
      expect(mockTagService.restoreTag).toHaveBeenCalledTimes(1);
      expect(mockTagService.restoreTag).toHaveBeenCalledWith(boardId);
    });
  });

  describe('thumbUpOrDown', () => {
    it('좋아요 성공', async () => {
      //given
      const boardId = 1;
      const user: User = {
        id: 1,
        email: '',
        userName: '',
        password: '',
        thumb: [],
        board: new Board(),
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const findBoard: Board = {
        id: 1,
        title: '',
        content: '',
        countThumbUp: 0,
        views: 0,
        thumb: [],
        user: new User(),
        hashTag: [],
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockThumbService.thumbUpOrDown.mockReturnValue(true);
      mockThumbService.countThumb.mockReturnValue(findBoard.countThumbUp);
      mockBoardRepository.save.mockReturnValue(findBoard);

      //when
      const result = await boardService.thumbUpOrDown(boardId, user);

      //then
      expect(result.isThumb).toBeTruthy();
      expect(mockBoardRepository.save).toHaveBeenCalledTimes(1);
      expect(mockThumbService.thumbUpOrDown).toHaveBeenCalledTimes(1);
      expect(mockThumbService.countThumb).toHaveBeenCalledTimes(1);
    });
  });
});
