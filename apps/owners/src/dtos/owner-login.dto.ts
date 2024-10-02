import { PickType } from '@nestjs/swagger';
import { CreateOwnerDto } from './create-owner.dto';

export class OwnerLoginDto extends PickType(CreateOwnerDto, [
  'email',
  'password',
]) {}
