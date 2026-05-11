import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EventsModule,
    CloudinaryModule,
    StripeModule,
  ],
})
export class AppModule {}