import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    try {
      return await this.prisma.event.create({
        data: {
          title: data.title,
          description: data.description,
          location: data.location,
          image:
            data.image ||
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
          date: new Date(data.date),
        },
      });
    } catch (error) {
      console.log(error);

      return {
        error: 'Cannot create event',
      };
    }
  }

  async delete(id: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new NotFoundException(
        'Event not found',
      );
    }

    return this.prisma.event.delete({
      where: {
        id,
      },
    });
  }
}