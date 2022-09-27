import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardService } from 'src/board/board.service';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/user/entity/user.entity';
import { HashTag } from './entity/tag.entity';
import { TagService } from './tag.service';

describe('TagService', () => {
  let tagService: TagService;
  let boardService: BoardService;

  const mockBoardService = {
    findBoardById: jest.fn(),
  };

  const mockTagRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: getRepositoryToken(HashTag), useValue: mockTagRepository },
        { provide: BoardService, useValue: mockBoardService },
      ],
    }).compile();

    tagService = module.get<TagService>(TagService);
    boardService = module.get<BoardService>(BoardService);

    mockBoardService.findBoardById.mockClear();
    mockTagRepository.create.mockClear();
    mockTagRepository.delete.mockClear();
    mockTagRepository.find.mockClear();
    mockTagRepository.restore.mockClear();
    mockTagRepository.save.mockClear();
    mockTagRepository.softDelete.mockClear();
  });

  it('should be defined', () => {
    expect(tagService).toBeDefined();
  });

  describe('saveTag', () => {
    it('해시태그 저장 성공', async () => {
      //given
      const boardId = 1;
      const tagStrings = '#태그,#해시';

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

      const tag1: HashTag = {
        id: undefined,
        tagName: '태그',
        board: findBoard,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const tag2: HashTag = {
        id: undefined,
        tagName: '해시',
        board: findBoard,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveTag1: HashTag = {
        id: 1,
        tagName: '태그',
        board: findBoard,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveTag2: HashTag = {
        id: 2,
        tagName: '해시',
        board: findBoard,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      mockBoardService.findBoardById.mockReturnValue(findBoard);
      mockTagRepository.create.mockReturnValueOnce(tag1);
      mockTagRepository.create.mockReturnValueOnce(tag2);
      mockTagRepository.save.mockReturnValueOnce(saveTag1);
      mockTagRepository.save.mockReturnValueOnce(saveTag2);

      //when
      const result: void = await tagService.saveTag(boardId, tagStrings);

      //then
      const tagList = tagStrings.replace(/#/g, '').split(',');
      const countfor: number = tagList.length;

      expect(mockBoardService.findBoardById).toHaveBeenCalledTimes(1);
      expect(mockBoardService.findBoardById).toHaveBeenCalledWith(boardId);
      expect(mockTagRepository.create).toHaveBeenCalledTimes(countfor);
      expect(mockTagRepository.create).toHaveBeenLastCalledWith({
        tagName: tagList[1],
        board: findBoard,
      });
      expect(mockTagRepository.save).toHaveBeenCalledTimes(countfor);
      expect(mockTagRepository.save).toHaveBeenLastCalledWith(tag2);
      expect(result).toBeUndefined();
    });
    it('게시글 없음', async () => {
      //given
      const boardId = 1;
      const tagStrings = '#태그,#해시';

      mockBoardService.findBoardById.mockRejectedValue(new NotFoundException());

      //when

      //then
      expect(async () => {
        await tagService.saveTag(boardId, tagStrings);
      }).rejects.toThrowError(new NotFoundException());
      expect(mockBoardService.findBoardById).toHaveBeenCalledTimes(1);
      expect(mockTagRepository.create).toHaveBeenCalledTimes(0);
      expect(mockTagRepository.save).toHaveBeenCalledTimes(0);
    });
  });
});
