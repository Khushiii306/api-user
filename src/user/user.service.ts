import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(where: Prisma.usersFindManyArgs): Promise<users[]> {
    return await this.prisma.users.findMany(where);
  }

  async findById(where: Prisma.usersFindManyArgs): Promise<users[]> {
    return await this.prisma.users.findMany(where);
  }

  //create user method
  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    const { email, username, password } = data;

    // @ts-ignore
    const [emails, usernames] = await Promise.all([
      // @ts-ignore
      this.checkEmail({ email }),
      // @ts-ignore
      this.checkEmail({ username }),
    ]);
    if (usernames) throw new BadRequestException('username already exists');
    if (emails) throw new BadRequestException('email already exists');

    const hash = await this.hashPassword(password);
    const newData = { ...data, password: hash };
    return await this.prisma.users.create({
      data: newData,
    });
  }

  async updateUser(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const { data, where } = params;
    const { email, username, password } = data;
    // @ts-ignore
    const user = await this.checkId(where);
    if (user.isDeleted) throw new BadRequestException('user  not found');
    // @ts-ignore
    if (email && email !== user.email) throw new BadRequestException('email already exists');
    if (username && username !== user.username) throw new BadRequestException('username already exists');
    const hash = await this.hashPassword(password);
    const newData = { ...data, password: hash };
    return this.prisma.users.update({
      data: newData,
      where,
    });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    // @ts-ignore
    const isDel = await this.checkId(where);
    if (isDel.isDeleted) throw new BadRequestException('user  not found');
    const data = { ...isDel, isDeleted: true };
    console.log(data);
    return this.prisma.users.update({
      where,
      data,
    });
  }

  async checkEmail(where: Prisma.usersFindFirstArgs): Promise<users> {
    // @ts-ignore
    return this.prisma.users.findFirst({ where });
  }

  async checkId(where: Prisma.usersFindUniqueArgs): Promise<users> {
    // @ts-ignore
    return this.prisma.users.findUnique({ where });
  }

  async hashPassword(password): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
