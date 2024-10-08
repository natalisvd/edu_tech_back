import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import {  Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const user: User = await this.userService
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
    // return await this.userService.save(dto).catch((err) => {
    //   this.logger.error(err);
    //   return null;
    // });

  const defaultAvatarUrl = 'https://img.freepik.com/free-photo/beautiful-kitten-with-colorful-clouds_23-2150752964.jpg?size=626&ext=jpg&ga=GA1.1.1297763733.1728259200&semt=ais_hybrid';

  const newUserData = {
    ...dto,
    avatarUrl: defaultAvatarUrl,
  };
  
  const newUser = await this.userService.save(newUserData).catch((err) => {
    this.logger.error(err);
    return null;
  });

  return newUser;
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.userService
      .findOne(dto.email, true)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
      });
    const refreshToken = await this.getRefreshToken(user.id, agent);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({
      where: { token: refreshToken },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.prismaService.token.delete({
      where: { token: refreshToken },
    });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(token.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user, agent);
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: { userId, userAgent: agent },
    });

    const token = _token?.token ?? '';
    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({ where: { token } });
  }

}
