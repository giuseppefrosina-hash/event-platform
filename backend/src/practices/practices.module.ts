import { Module } from '@nestjs/common';

import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PracticesController],
  providers: [PracticesService, PrismaService],
})
export class PracticesModule {}