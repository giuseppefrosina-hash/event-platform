import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    eventId: string;
    quoteNumber: string;
    clientName: string;
    totalAmount: number;
    vatAmount: number;
    status: string;
  }) {
    return this.prisma.quote.create({
      data: {
        eventId: data.eventId,
        quoteNumber: data.quoteNumber,
        clientName: data.clientName,
        totalAmount: Number(data.totalAmount || 0),
        vatAmount: Number(data.vatAmount || 0),
        status: data.status || 'draft',
      },
      include: {
        event: true,
      },
    });
  }

  async findAll() {
    return this.prisma.quote.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: true,
      },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.quote.findMany({
      where: {
        eventId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.quote.delete({
      where: {
        id,
      },
    });
  }
}