import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: {
        id: 'desc',
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

  async create(
    body: any,
    userId: number,
  ) {
    return this.prisma.event.create({
      data: {
        title: body.title,

        description:
          body.description,

        location: body.location,

        image:
          body.image ||
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',

        date: new Date(body.date),

        userId,
      },
    });
  }

  async delete(
    id: number,
    userId: number,
  ) {
    return this.prisma.event.delete({
      where: {
        id,
      },
    });
  }
}