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
    paidAmount?: number;
    status: string;
  }) {
    const totalAmount = Number(data.totalAmount || 0);
    const paidAmount = Number(data.paidAmount || 0);
    const remainingAmount = totalAmount - paidAmount;

    return this.prisma.quote.create({
      data: {
        eventId: data.eventId,
        quoteNumber: data.quoteNumber,
        clientName: data.clientName,
        totalAmount,
        vatAmount: Number(data.vatAmount || 0),
        paidAmount,
        remainingAmount,
        status:
          remainingAmount <= 0 && totalAmount > 0
            ? 'paid'
            : data.status || 'draft',
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

  async update(
    id: string,
    data: {
      clientName?: string;
      totalAmount?: number;
      vatAmount?: number;
      paidAmount?: number;
      status?: string;
    },
  ) {
    const current = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error('Preventivo non trovato');
    }

    const totalAmount =
      data.totalAmount !== undefined
        ? Number(data.totalAmount)
        : Number(current.totalAmount || 0);

    const paidAmount =
      data.paidAmount !== undefined
        ? Number(data.paidAmount)
        : Number(current.paidAmount || 0);

    const remainingAmount = totalAmount - paidAmount;

    return this.prisma.quote.update({
      where: { id },
      data: {
        clientName: data.clientName ?? current.clientName,
        totalAmount,
        vatAmount:
          data.vatAmount !== undefined
            ? Number(data.vatAmount)
            : Number(current.vatAmount || 0),
        paidAmount,
        remainingAmount,
        status:
          remainingAmount <= 0 && totalAmount > 0
            ? 'paid'
            : data.status ?? current.status,
      },
      include: {
        event: true,
      },
    });
  }

  async generateFromEvent(eventId: string, markup: number) {
    const costs = await this.prisma.eventCost.findMany({
      where: {
        eventId,
      },
    });

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error('Evento non trovato');
    }

    const totalCosts = costs.reduce(
      (sum, cost) => sum + Number(cost.totalCost || 0),
      0,
    );

    const totalAmount =
      totalCosts + totalCosts * (markup / 100);

    const vatAmount = totalAmount * 0.22;

    return this.prisma.quote.create({
      data: {
        eventId,
        quoteNumber: `Q-${Date.now()}`,
        clientName: event.title,
        totalAmount,
        vatAmount,
        paidAmount: 0,
        remainingAmount: totalAmount,
        status: 'draft',
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