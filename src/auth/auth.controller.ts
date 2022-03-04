import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { users as UserModel } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() userData: UserModel):  Promise<{token: string} | null> {
    return this.authService.loginUser(userData);
    }





}
