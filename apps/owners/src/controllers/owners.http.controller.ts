import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OwnersService } from '../services/owners.service';
import { CreateOwnerDto, OwnerLoginDto, UpdateOwnerDto } from '../dtos';
import { ParseMongoDBID } from '@libs/shared';
import { IsPublic } from '../utils';

@Controller('owners')
export class OwnersHttpController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @IsPublic()
  async createOwner(@Body() createOwnerDto: CreateOwnerDto) {
    const data = await this.ownersService.createOwner(createOwnerDto);
    return data;
  }

  @Post('login')
  @IsPublic()
  async ownerLogin(@Body() loginDto: OwnerLoginDto) {
    const data = await this.ownersService.loginOwner(loginDto);
    return data;
  }

  @Put(':id')
  async updateOwner(
    @Param('id', ParseMongoDBID) ownerId: string,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    const data = await this.ownersService.updateOwner(ownerId, updateOwnerDto);
    return data;
  }

  @Get(':id')
  @IsPublic()
  async findOwner(@Param('id', ParseMongoDBID) ownerId: string) {
    const data = await this.ownersService.findOneOwner(ownerId);
    return data;
  }

  @Get()
  @IsPublic()
  async findOwners() {
    const data = await this.ownersService.findOwners();
    return data;
  }
}
