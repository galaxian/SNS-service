import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/user/entity/user.entity';
import { Thumb } from './entity/thumb.entity';
import { ThumbService } from './thumb.service';

describe('ThumbService', () => {
  let thumbService: ThumbService;

  const mockThumbRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    countBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThumbService,
        { provide: getRepositoryToken(Thumb), useValue: mockThumbRepository },
      ],
    }).compile();

    thumbService = module.get<ThumbService>(ThumbService);

    mockThumbRepository.create.mockClear();
    mockThumbRepository.findOne.mockClear();
    mockThumbRepository.save.mockClear();
    mockThumbRepository.countBy.mockClear();
  });

  it('should be defined', () => {
    expect(thumbService).toBeDefined();
  });

  describe('createThumb', () => {
    it('좋아요 생성', async () => {
      //given
      const board: Board = {
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

      const createThumb: Thumb = {
        id: 0,
        user: user,
        board: board,
        isThumb: undefined,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveThumb: Thumb = {
        id: 1,
        user: user,
        board: board,
        isThumb: true,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockThumbRepository.create.mockReturnValue(createThumb);
      mockThumbRepository.save.mockReturnValue(saveThumb);

      //when
      const result: boolean = await thumbService.createThumb(board, user);

      //then
      expect(result).toBeTruthy();
      expect(mockThumbRepository.create).toHaveBeenCalledTimes(1);
      expect(mockThumbRepository.create).toHaveBeenCalledWith({ board, user });
      expect(mockThumbRepository.save).toHaveBeenCalledTimes(1);
      expect(mockThumbRepository.save).toHaveBeenCalledWith(createThumb);
    });
  });

  describe('thumbChange', () => {
    it('좋아요 취소', async () => {
      //given
      const thumb: Thumb = {
        id: 1,
        user: new User(),
        board: new Board(),
        isThumb: true,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockThumbRepository.save.mockReturnValue(thumb);

      //when
      const result: boolean = await thumbService.thumbChange(thumb);

      //then
      expect(result).toBeFalsy();
      expect(mockThumbRepository.save).toHaveBeenCalledTimes(1);
      expect(mockThumbRepository.save).toHaveBeenCalledWith(thumb);
    });
    it('좋아요 증가', async () => {
      //given
      const thumb: Thumb = {
        id: 1,
        user: new User(),
        board: new Board(),
        isThumb: false,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockThumbRepository.save.mockReturnValue(thumb);

      //when
      const result: boolean = await thumbService.thumbChange(thumb);

      //then
      expect(result).toBeTruthy();
      expect(mockThumbRepository.save).toHaveBeenCalledTimes(1);
      expect(mockThumbRepository.save).toHaveBeenCalledWith(thumb);
    });
  });
});
