import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PracticesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.practice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    title: string;
    businessType: string;
    clientName: string;
    startDate?: string;
    endDate?: string;
    participants?: number;
    status?: string;
    notes?: string;
  }) {
    const year = new Date().getFullYear();

    const count = await this.prisma.practice.count();

    const practiceNumber =
      'PRT-' +
      year +
      '-' +
      String(count + 1).padStart(4, '0');

    return this.prisma.practice.create({
      data: {
        practiceNumber,
        title: data.title,
        businessType: data.businessType,
        clientName: data.clientName,
        startDate: data.startDate
          ? new Date(data.startDate)
          : null,
        endDate: data.endDate
          ? new Date(data.endDate)
          : null,
        participants: Number(data.participants || 0),
        status: data.status || 'lead',
        notes: data.notes || null,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      businessType?: string;
      clientName?: string;
      startDate?: string;
      endDate?: string;
      participants?: number;
      status?: string;
      notes?: string;
    },
  ) {
    return this.prisma.practice.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        businessType: data.businessType,
        clientName: data.clientName,
        startDate:
          data.startDate !== undefined
            ? data.startDate
              ? new Date(data.startDate)
              : null
            : undefined,
        endDate:
          data.endDate !== undefined
            ? data.endDate
              ? new Date(data.endDate)
              : null
            : undefined,
        participants:
          data.participants !== undefined
            ? Number(data.participants || 0)
            : undefined,
        status: data.status,
        notes: data.notes,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.practice.delete({
      where: {
        id,
      },
    });
  }
}