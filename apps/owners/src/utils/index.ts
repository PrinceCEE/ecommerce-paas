import { Transform } from 'class-transformer';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';
import {
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { Owner } from '../schemas';
import { OwnerResponse } from '../types';

export const mapToOwnerResponse = (owner: Owner): OwnerResponse => {
  return {
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    address: owner.address,
    createdAt: owner.createdAt.toISOString(),
    updatedAt: owner.updatedAt.toISOString(),
  };
};

export const ToLower = (): PropertyDecorator => {
  return Transform(({ value }) => value.toLowerCase());
};

export const hashPassword = async (pwd: string) => {
  const salt = await genSalt(10);
  return hash(pwd, salt);
};

export const comparePassword = (pwdHash: string, pwd: string) => {
  return compare(pwd, pwdHash);
};

export const generateAccessToken = async (data: { sub: string }) => {
  return sign(data, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const verifyToken = async (token: string) => {
  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedException(err.message);
  }
};

export const IS_PUBLIC_ROUTE = 'IS_PUBLIC_ROUTE';
export const IsPublic = () => SetMetadata(IS_PUBLIC_ROUTE, true);

export const Auth = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & { user: Owner }>();
    return data ? req.user[data] : req.user;
  },
);
