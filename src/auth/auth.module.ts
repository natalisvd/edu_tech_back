import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { options } from './config';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [
    PassportModule, 
    JwtModule.registerAsync(options()),
    UserModule,
    HttpModule
  ],
})
export class AuthModule {}
