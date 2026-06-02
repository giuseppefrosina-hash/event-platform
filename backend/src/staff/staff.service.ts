import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(data: any) {
    return this.prisma.staff.create({
      data,
    });
  }

  findAll() {
    return this.prisma.staff.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.staff.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: any) {
    return this.prisma.staff.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.staff.delete({
      where: {
        id,
      },
    });
  }
}