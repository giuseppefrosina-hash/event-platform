import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        image:
          data.image ||
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        date: data.date ? new Date(data.date) : new Date(),
        price: data.price || 0,
        userId: data.userId,
      },
    });
  }

  async update(id: number, userId: number, data: any) {
    return this.prisma.event.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number, userId: number) {
    return this.prisma.event.delete({
      where: {
        id,
      },
    });
  }
}