import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { StripeModule } from './stripe/stripe.module';
import { CloudinaryModule } from './upload/cloudinary/cloudinary.module';
import { CompaniesModule } from './companies/companies.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { StaffModule } from './staff/staff.module';
import { TicketsModule } from './tickets/tickets.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventsModule,
    StripeModule,
    CloudinaryModule,
    CompaniesModule,
    SuppliersModule,
    CollaboratorsModule,
    StaffModule,
  ],
})
export class AppModule {}
