import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //create user method
  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    const { email, username } = data;

    // @ts-ignore
    const [emails, usernames] = await Promise.all([this.checkEmail({email}), this.checkEmail({username})]);
    if (usernames) throw new BadRequestException('username already exists');
    if (emails) throw new BadRequestException('email already exists');
    return await this.prisma.users.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const { data, where } = params;
    const { email, username } = data;
    // @ts-ignore
    if (email) {
      // @ts-ignore
      const emails = await this.checkEmail({ email });
      if (emails) throw new BadRequestException('email already exists');
    }
    if (username) {
      // @ts-ignore
      const usernames = await this.checkEmail({ username });
      if (usernames) throw new BadRequestException('username already exists');
    }
    return this.prisma.users.update({
      data,
      where,
    });
  }


  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    // @ts-ignore
    const isDeleted = await this.checkId(where);
    if (!isDeleted) throw new BadRequestException('user  not found');
    return this.prisma.users.delete({
      where,
    });
  }

  async checkEmail(where: Prisma.usersFindFirstArgs): Promise<boolean> {
    // @ts-ignore
    return this.prisma.users.findFirst({ where });
  }

  async checkId(where: Prisma.usersFindUniqueArgs): Promise<boolean> {
    // @ts-ignore
    return this.prisma.users.findUnique({ where });
  }
}
