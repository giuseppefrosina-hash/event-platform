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
        createdAt: 'desc',
      },
      include: {
        company: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
      },
    });
  }

  async create(data: any) {
    console.log('CREATE EVENT BODY:', data);
console.log('CREATE EVENT PRICE:', data.price);

    const priceValue = Number(data.price);

    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        location: data.location || null,
        image:
          data.image ||
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
        date: new Date(data.date),
        price: Number.isNaN(priceValue)
          ? 0
          : priceValue,
        companyId: data.companyId || null,
      },
      include: {
        company: true,
      },
    });
  }

  async delete(id: string) {
  const event =
    await this.prisma.event.findUnique({
      where: {
        id,
      },
    });

  if (!event) {
    throw new NotFoundException(
      'Event not found',
    );
  }

  await this.prisma.ticket.deleteMany({
    where: {
      eventId: id,
    },
  });

  await this.prisma.eventCost.deleteMany({
    where: {
      eventId: id,
    },
  });

  await this.prisma.quote.deleteMany({
    where: {
      eventId: id,
    },
  });

  await this.prisma.travel.deleteMany({
    where: {
      eventId: id,
    },
  });

  return this.prisma.event.delete({
    where: {
      id,
    },
  });
}

}