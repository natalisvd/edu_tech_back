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
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponce } from './responses';
import { CurrentUser } from 'libs/common/src/decorators';
import { JwtPayload } from 'src/auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateDto } from 'libs/common/src/helpers';
import { resizeAndOptimizeImage } from 'libs/common/src/helpers/resize-image-helper';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('teamleaders/:withTeams')
  async findAllTeamleaders(@Param('withTeams') withTeams: boolean) {
    return this.userService.findAllTeamLeaders(withTeams);
  }

  @Get('workers')
  async findAllWorkers() {
    return this.userService.findAllWorkers();
  }

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
        return new UserResponce(user);
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

  @Patch('currentUser')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    try {
      const currentUser = await this.userService.findOne(user.id);

      if (!currentUser) {
        throw new BadRequestException('User not found');
      }

      const avatarDir = path.join(__dirname, '..','..','..', 'images');
      if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
      }

      if (currentUser.avatarUrl) {
        try {
          const oldAvatarPath = path.join(avatarDir, currentUser.avatarUrl);
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }

      if (avatar) {
        const optimizedImageBuffer = await resizeAndOptimizeImage(
          avatar.buffer,
        );
        const fileExt = path.extname(avatar.originalname);
        const avatarName = `avatar_${Date.now()}${fileExt}`;
        const avatarPath = path.join(avatarDir, avatarName);

        fs.writeFileSync(avatarPath, optimizedImageBuffer);
        currentUser.avatarUrl = avatarName;
      }
      currentUser.firstName = body.firstName;
      currentUser.lastName = body.lastName;

      return new UserResponce(await this.userService.update(currentUser));
    } catch (error) {
      throw new BadRequestException('Error updating user');
    }
  }

  @Patch('updateUserMultiple')
  async updateMultipleUsers(
    @Body() users: Partial<User>[],
  ): Promise<{ message: string }> {
    try {
      await this.userService.updateMultipleUsers(users);
      return { message: 'Users updated successfully' };
    } catch (error) {
      console.error('Error in updateMultipleUsers controller:', error);
      throw new HttpException(
        'Failed to update users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
