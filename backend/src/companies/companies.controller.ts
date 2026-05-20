import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.companiesService.findAll(
      req.user.userId,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.companiesService.findOne(
      id,
      req.user.userId,
    );
  }

  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: {
      name: string;
      vatNumber?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.companiesService.create(
      req.user.userId,
      body,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body()
    body: {
      name?: string;
      vatNumber?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.companiesService.update(
      id,
      req.user.userId,
      body,
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.companiesService.delete(
      id,
      req.user.userId,
    );
  }
}