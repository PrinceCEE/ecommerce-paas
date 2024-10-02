import { IsEmail, IsString, MinLength } from 'class-validator';
import { ToLower } from '../utils';

export class CreateOwnerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @ToLower()
  email: string;

  @IsString()
  address: string;

  @IsString()
  @MinLength(8)
  password: string;
}
