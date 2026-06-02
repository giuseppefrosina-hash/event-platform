
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StaffModule } from './staff/staff.module';
import { CloudinaryModule } from './upload/cloudinary/cloudinary.module';
import { TicketsModule } from './tickets/tickets.module';
import { MailModule } from './mail/mail.module';
import { EventCostsModule } from './event-costs/event-costs.module';
import { QuotesModule } from './quotes/quotes.module';

@Module({
imports: [
  AuthModule,
  EventsModule,
  CompaniesModule,
  SuppliersModule,
  StaffModule,
  CloudinaryModule,
  TicketsModule,
  MailModule,
  EventCostsModule,
  QuotesModule,
],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}