import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, users } from '@prisma/client';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { useCaseSensitiveFileNames } from 'ts-loader/dist/utils';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private userService: UserService, private jwtService: JwtService) {}


  //create user method
  async loginUser(data: Prisma.usersCreateInput): Promise<{token: string} | null> {
    const { username, password } = data;
    if (username) {
      // @ts-ignore
      const user = await this.userService.checkEmail({ username });
      if (!user) throw new BadRequestException('wrong username and password');
      if (user.isDeleted) throw new BadRequestException('user not found');
      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          throw new BadRequestException('wrong username and password');
      }
      delete user.password;
      const jwt = await this.jwtService.signAsync({ user });
      return { token: jwt };
    }
  }
}

