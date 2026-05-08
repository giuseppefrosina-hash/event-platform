// backend/src/users/users.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service'; // Importiamo il Service
import { CreateUserDto } from './create-user.dto'; // Importiamo il DTO

@Controller('users') // QUESTO CREA L'INDIRIZZO http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Quando qualcuno fa una richiesta POST a /users, creiamo l'utente
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Quando qualcuno fa una richiesta GET a /users, vediamo tutti gli utenti
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}