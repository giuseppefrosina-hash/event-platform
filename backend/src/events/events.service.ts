import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
    const event =
      await this.prisma.event.findUnique({
        where: { id },
      });

    if (!event) {
      throw new NotFoundException(
        'Evento non trovato',
      );
    }

    return event;
  }

  async create(
    data: any,
    userId: number,
  ) {
    return this.prisma.event.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(
    id: number,
    data: any,
  ) {
    return this.prisma.event.update({
      where: { id },
      data,
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