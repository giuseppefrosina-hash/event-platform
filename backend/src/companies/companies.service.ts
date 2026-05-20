import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.company.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    userId: string,
  ) {
    return this.prisma.company.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async create(
    userId: string,
    data: {
      name: string;
      vatNumber?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.prisma.company.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      vatNumber?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.prisma.company.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(
    id: string,
    userId: string,
  ) {
    return this.prisma.company.delete({
      where: {
        id,
      },
    });
  }
}