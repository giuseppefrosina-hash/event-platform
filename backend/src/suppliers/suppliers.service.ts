import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.supplier.create({
      data,
    });
  }

  findAll() {
    return this.prisma.supplier.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.supplier.findUnique({
      where: { id },
    });
  }

  update(id: string, data: any) {
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}