import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponce } from './responses';
import { CurrentUser } from 'libs/common/src/decorators';
import { JwtPayload } from 'src/auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateDto } from 'libs/common/src/helpers';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':idOrEmail')
  async findOne(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponce(user);
  }
  @Get()
  async findAllUsers(@CurrentUser() currentUser: JwtPayload) {
    const users = await this.userService.findAllUsers();
    return users
      .filter((usr) => usr.id !== currentUser.id)
      .map((user) => {
        delete user.password;
        return user;
      });
  }

  @Post('currentUser')
  async currentUser(@CurrentUser() user: JwtPayload) {
    return this.findOne(user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.userService.delete(id, user);
  }





  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
