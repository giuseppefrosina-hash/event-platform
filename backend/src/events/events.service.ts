import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date ? new Date(data.date) : new Date(),
        price: data.price || 0,
        image: data.image || '',
        userId: 1,
      },
    });
  }

  async findAll() {
    try {
      return await this.prisma.event.findMany({
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }
}