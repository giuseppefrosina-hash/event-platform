import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, userId: number) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
        userId,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany({
      include: {
        user: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async update(id: number, data: any, userId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento non trovato');
    }

    if (event.userId !== userId) {
      throw new ForbiddenException(
        'Non puoi modificare questo evento',
      );
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
      },
    });
  }

  async delete(id: number, userId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento non trovato');
    }

    if (event.userId !== userId) {
      throw new ForbiddenException(
        'Non puoi eliminare questo evento',
      );
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}