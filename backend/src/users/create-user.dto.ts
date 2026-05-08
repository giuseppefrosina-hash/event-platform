// backend/src/users/create-user.dto.ts

export class CreateUserDto {
  email: string;
  name: string;
  password: string; // <-- CAMBIATO DA 'passwordHash' A 'password'
}