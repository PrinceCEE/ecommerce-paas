import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE, verifyToken } from './utils';
import { Request } from 'express';
import { Owner } from './schemas';
import { OwnerRepository } from './repositories';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly ownersRepository: OwnerRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_ROUTE,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request & { owner: Owner }>();
    const payload = (await this.getPayload(req)) as JwtPayload;

    const owner = await this.ownersRepository.findById(payload.sub);
    if (!owner) {
      throw new UnauthorizedException('invalid token');
    }

    req.owner = owner;
    return true;
  }

  async getPayload(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token not provided');
    }

    try {
      return await verifyToken(token);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
