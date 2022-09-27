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
  };

  const mockThumbService = {};

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
  });
});
