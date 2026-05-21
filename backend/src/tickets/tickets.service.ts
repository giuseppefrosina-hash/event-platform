import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: true,
      },
    });
  }

  async create(data: {
    eventId: string;
    fullName: string;
    email: string;
  }) {
    const qrCode =
      crypto.randomUUID();

    return this.prisma.ticket.create({
      data: {
        eventId: data.eventId,
        fullName: data.fullName,
        email: data.email,
        qrCode,
      },
      include: {
        event: true,
      },
    });
  }

  async checkIn(qrCode: string) {
    return this.prisma.ticket.update({
      where: {
        qrCode,
      },
      data: {
        checkedIn: true,
      },
    });
  }
}