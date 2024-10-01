import { Controller } from '@nestjs/common';
import { OwnersService } from '../services/owners.service';

@Controller('owners')
export class OwnersHttpController {
  constructor(private readonly ownersService: OwnersService) {}
}
