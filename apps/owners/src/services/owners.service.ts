import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OwnerRepository } from '../repositories';
import { CreateOwnerDto, OwnerLoginDto, UpdateOwnerDto } from '../dtos';
import { ApiResponse, OwnerResponse } from '../types';
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
  mapToOwnerResponse,
} from '../utils';
import { EventNames, RabbitMQNames } from '@libs/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OwnersService {
  constructor(
    private readonly ownerRepository: OwnerRepository,
    @Inject(RabbitMQNames.OWNER) private client: ClientProxy,
  ) {}

  async createOwner(
    createOwnerDto: CreateOwnerDto,
  ): Promise<ApiResponse<{ owner: OwnerResponse; accessToken: string }>> {
    const ownerExists = await this.ownerRepository.findByEmail(
      createOwnerDto.email,
    );

    if (ownerExists) {
      throw new BadRequestException('Owner already exists');
    }

    createOwnerDto.password = await hashPassword(createOwnerDto.password);
    const owner = await this.ownerRepository.create(createOwnerDto);
    const accessToken = await generateAccessToken({ sub: owner.id });
    return {
      message: 'Owner created',
      data: { owner: mapToOwnerResponse(owner), accessToken },
    };
  }

  async loginOwner(
    loginDto: OwnerLoginDto,
  ): Promise<ApiResponse<{ accessToken: string; owner: OwnerResponse }>> {
    const owner = await this.ownerRepository.findByEmail(loginDto.email);
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    if (!(await comparePassword(owner.password, loginDto.password))) {
      throw new UnauthorizedException('Invalid email  or password');
    }

    const accessToken = await generateAccessToken({ sub: owner.id });
    return {
      message: 'Owner logged in',
      data: { accessToken, owner: mapToOwnerResponse(owner) },
    };
  }

  async updateOwner(
    ownerId: string,
    updateOwnerDto: UpdateOwnerDto,
  ): Promise<ApiResponse<{ owner: OwnerResponse }>> {
    const ownerExists = await this.ownerRepository.findById(ownerId);
    if (!ownerExists) {
      throw new NotFoundException('Owner not found');
    }

    const owner = await this.ownerRepository.update(ownerId, updateOwnerDto);

    this.client.emit(EventNames.OWNER_UPDATED, mapToOwnerResponse(owner));
    return {
      message: 'Owner updated',
      data: { owner: mapToOwnerResponse(owner) },
    };
  }

  async findOneOwner(
    ownerId: string,
  ): Promise<ApiResponse<{ owner: OwnerResponse }>> {
    const owner = await this.ownerRepository.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    return {
      message: 'Owner fetched',
      data: { owner: mapToOwnerResponse(owner) },
    };
  }

  async findOwners(): Promise<ApiResponse<{ owners: OwnerResponse[] }>> {
    return {
      message: 'Owners fetched',
      data: {
        owners: await this.ownerRepository
          .findAll()
          .then((owners) => owners.map((owner) => mapToOwnerResponse(owner))),
      },
    };
  }
}
