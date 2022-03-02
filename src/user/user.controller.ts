import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Put, UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { users as UserModel } from '@prisma/client';
// import {HttpExceptionFilter} from "../validation/http-exception.filter";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  this method used for creating user in to the system
   */
  @Post()
  async signupUser(@Body() userData: UserModel): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async publishPost(@Param('id') id: number, @Body() userData: UserModel): Promise<UserModel> {

    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }
  // @UseFilters(new HttpExceptionFilter())
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Body() userData: UserModel): Promise<UserModel> {
    console.log(userData);
    return this.userService.deleteUser({ id: Number(id) });
  }
}
