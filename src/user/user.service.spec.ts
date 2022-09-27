import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignUpRequestDto } from './dto/req/signupreq.dto';
import { SignUpResposneDto } from './dto/res/signupres.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { SignInRequestDto } from './dto/req/signin.req.dto';

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(() => 'token'),
  };

  const mockUserRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    mockUserRepository.create.mockClear();
    mockUserRepository.findOne.mockClear();
    mockUserRepository.save.mockClear();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('signUp', () => {
    it('회원가입 성공', async () => {
      //given
      const input: SignUpRequestDto = {
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'abcd1234>?',
        checkPassword: 'abcd1234>?',
      };

      const user: User = {
        id: undefined,
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'hashPassword',
        thumb: [],
        board: null,
        createAt: undefined,
        updateAt: undefined,
        deleteAt: undefined,
      };

      const saveUser: User = {
        id: 1,
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'hashPassword',
        thumb: [],
        board: null,
        createAt: new Date(),
        updateAt: new Date(),
        deleteAt: undefined,
      };

      mockUserRepository.findOne.mockImplementationOnce((email) => null);

      mockUserRepository.findOne.mockImplementationOnce((userName) => null);

      mockUserRepository.create.mockImplementation((input) => user);

      mockUserRepository.save.mockImplementation((user) => saveUser);

      //when
      const result: SignUpResposneDto = await userService.signUp(input);

      //then
      expect(result.email).toEqual(input.email);
      expect(result.userName).toEqual(input.userName);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
    it('회원가입 email 중복', async () => {
      //given
      const input: SignUpRequestDto = {
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'abcd1234>?',
        checkPassword: 'abcd1234>?',
      };

      const findUser: User = {
        id: 1,
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'hashPassword',
        thumb: [],
        board: null,
        createAt: new Date(),
        updateAt: new Date(),
        deleteAt: undefined,
      };

      mockUserRepository.findOne.mockImplementation((email) => findUser);

      mockUserRepository.create.mockImplementation((input) => null);

      mockUserRepository.save.mockImplementation((user) => null);

      //when

      //then
      expect(async () => {
        await userService.signUp(input);
      }).rejects.toThrowError(
        new BadRequestException({
          statusCode: 400,
          message: '이미 존재하는 이메일입니다.',
        }),
      );
      expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    });
    it('회원가입 닉네임 중복', async () => {
      //given
      const input: SignUpRequestDto = {
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'abcd1234>?',
        checkPassword: 'abcd1234>?',
      };

      const findUser: User = {
        id: 1,
        email: 'abcd1234@naver.com',
        userName: 'hahahaha',
        password: 'hashPassword',
        thumb: [],
        board: null,
        createAt: new Date(),
        updateAt: new Date(),
        deleteAt: undefined,
      };

      mockUserRepository.findOne.mockImplementationOnce((email) => null);

      mockUserRepository.findOne.mockImplementationOnce((userName) => findUser);

      mockUserRepository.create.mockImplementation((input) => null);

      mockUserRepository.save.mockImplementation((user) => null);

      //when

      //then
      expect(async () => {
        await userService.signUp(input);
      }).rejects.toThrowError(
        new BadRequestException({
          statusCode: 400,
          message: '이미 존재하는 닉네임입니다.',
        }),
      );
      expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    });
    it('비밀번호, 비밀번호 확인 불일치', async () => {
      //given
      const input: SignUpRequestDto = {
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'abcd1234>?',
        checkPassword: 'sekdnfeee222',
      };

      mockUserRepository.findOne.mockImplementation((email) => null);

      mockUserRepository.create.mockImplementation((input) => null);

      mockUserRepository.save.mockImplementation((user) => null);

      //when

      //then
      expect(async () => {
        await userService.signUp(input);
      }).rejects.toThrowError(
        new BadRequestException({
          statusCode: 400,
          message: '비밀번호가 일치하지 않습니다.',
        }),
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('signIn', () => {
    it('로그인 성공', async () => {
      //given
      const input: SignInRequestDto = {
        email: 'abcd1234@gmail.com',
        password: 'abcd1234>?',
      };

      const findUser: User = {
        id: 1,
        email: 'abcd1234@gmail.com',
        userName: 'hahahaha',
        password: 'hashPassword',
        thumb: [],
        board: null,
        createAt: new Date(),
        updateAt: new Date(),
        deleteAt: undefined,
      };

      mockUserRepository.findOne.mockImplementation((email) => findUser);

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      //when
      const result = await userService.signIn(input);

      //then
      expect(result.accessToken).toEqual(expect.any(String));
    });
  });
});
