import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  cardId?: string;
  @IsOptional()
  @IsString()
  timeLearning?: string;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsString()
  description ?: string;
  @IsOptional()
  @IsString()
  certificates?: string;
}
