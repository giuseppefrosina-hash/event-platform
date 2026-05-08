// backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto'; // Importiamo il DTO di prima

@Injectable()
export class UsersService {
  // Diciamo a NestJS di usare il nostro PrismaService
  constructor(private prisma: PrismaService) {}

  // Questo metodo crea l'utente nel Database
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // Questo metodo ci farà vedere tutti gli utenti (utile per i test)
  async findAll() {
    return this.prisma.user.findMany();
  }
}