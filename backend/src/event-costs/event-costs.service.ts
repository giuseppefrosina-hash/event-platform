import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventCostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    eventId: string;
    category: string;
    description: string;
    supplier?: string;
    quantity: number;
    unitCost: number;
    vat: number;
  }) {
    const quantity = Number(data.quantity || 1);
    const unitCost = Number(data.unitCost || 0);
    const vat = Number(data.vat || 0);

    const subtotal = quantity * unitCost;
    const totalCost = subtotal + subtotal * (vat / 100);

    return this.prisma.eventCost.create({
      data: {
        eventId: data.eventId,
        category: data.category,
        description: data.description,
        supplier: data.supplier || null,
        quantity,
        unitCost,
        vat,
        totalCost,
      },
      include: {
        event: true,
      },
    });
  }

  async findAll() {
    return this.prisma.eventCost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: true,
      },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.eventCost.findMany({
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
    return this.prisma.eventCost.delete({
      where: {
        id,
      },
    });
  }
}