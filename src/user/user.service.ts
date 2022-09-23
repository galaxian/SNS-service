import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/signupreq.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpResposneDto } from './dto/signupres.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
}
