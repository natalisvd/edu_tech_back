import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/interfaces';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.user[key] : request.user;
  },
);

export const CurrentUserWebsocket = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    const client =  ctx.switchToHttp().getRequest();
    const token = client.handshake.headers.authorization;
    const user = jwt.decode(token.replace('Bearer ', '')) as JwtPayload;
    return user;
  },
);
