import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../guard/jwt.guard';
import { JwtStrategy } from '../guard/jwt.strategy';

@Module({
  imports:[JwtModule.registerAsync({useFactory: () =>({
      secret: 'secret',
      signOptions: {expiresIn: '7d'},
    }),
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, JwtGuard, JwtStrategy],
})
export class AuthModule {}
