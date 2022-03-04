import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { users as UserModel } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../guard/jwt.guard';

// import {HttpExceptionFilter} from "../validation/http-exception.filter";
@UseGuards(JwtGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get(':id')
  async  getUser(@Param('id') id: number,@Body() userData: CreateUserDto): Promise<UserModel[]> {
    console.log(userData);
    return this.userService.findById({
      where: { id: Number(id) },
    });
  }

// get all users
  @Get('')
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers({
      where: { isDeleted: false },
    });
  }

  /*
  this method used for creating user in to the system
   */
  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async signupUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() userData: CreateUserDto): Promise<UserModel> {

    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  // @UseFilters(new HttpExceptionFilter())
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
