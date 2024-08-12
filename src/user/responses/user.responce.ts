import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponce implements User {
  id: string;
  email: string;

  firstName: string;
  lastName: string;
  avatarUrl: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  updatedAt: Date;
  roles: Role[];
  

  constructor(user: User) {
    Object.assign(this, user);
  }
}
