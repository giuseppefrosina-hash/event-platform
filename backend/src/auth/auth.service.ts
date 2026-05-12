import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'User already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    return {
      access_token:
        await this.jwtService.signAsync({
          userId: user.id,
          email: user.email,
        }),
    };
  }
}