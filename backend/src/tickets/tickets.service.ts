import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
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

    const ticket =
      await this.prisma.ticket.create({
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

    try {
      await this.mailService.sendTicketEmail(
  ticket.email,
  ticket.fullName,
  ticket.qrCode,
  ticket.event?.title || 'Evento',
);
    } catch (error) {
      console.log(
        'Email error:',
        error,
      );
    }

    return ticket;
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