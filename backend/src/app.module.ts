import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StaffModule } from './staff/staff.module';
import { UploadModule } from './upload/upload.module';
import { TicketsModule } from './tickets/tickets.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    CompaniesModule,
    SuppliersModule,
    StaffModule,
    UploadModule,
    TicketsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}