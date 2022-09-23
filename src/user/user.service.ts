import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/req/signupreq.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpResposneDto } from './dto/res/signupres.dto';
import { SignInRequestDto } from './dto/req/signin.req.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpRequestDto): Promise<SignUpResposneDto> {
    const { email, userName, password, checkPassword } = signUpDto;

    if (password !== checkPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const findUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    const findUserByUserName = await this.userRepository.findOne({
      where: { userName },
    });

    if (findUserByEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    if (findUserByUserName) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.userRepository.create({
      email,
      userName,
      password: hashedPassword,
    });

    const saveUser = await this.userRepository.save(user);

    return {
      email: saveUser.email,
      userName: saveUser.userName,
    };
  }

  async signIn(signInDto: SignInRequestDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    const findUser: User = await this.userRepository.findOne({
      where: { email },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const isValidPassword = await bcrypt.compare(password, findUser.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { userName: findUser.userName };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
