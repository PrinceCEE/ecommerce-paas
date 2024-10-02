import { Transform } from 'class-transformer';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Owner } from '../schemas';
import { OwnerResponse } from '../types';
import { readFile } from 'fs/promises';

export const mapToOwnerResponse = (owner: Owner): OwnerResponse => {
  return {
    firstName: owner.firstName,
    lastName: owner.lastName,
    email: owner.email,
    address: owner.address,
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

export const generateAccessToken = async (data: { ownerId: string }) => {
  const privateKey = await readFile('filepath');
  const token = sign(data, privateKey, {
    algorithm: 'RS256',
    expiresIn: '24h',
  });
  return token;
};
