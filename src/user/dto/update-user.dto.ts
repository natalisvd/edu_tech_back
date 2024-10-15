import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'newStrongPassword123',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'URL of the user avatar (optional)',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

}
