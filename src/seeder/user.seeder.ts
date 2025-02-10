import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { AuthRepository } from 'src/modules/auth/auth.repository';

@Injectable()
export class UserSeeder {
  constructor(private readonly AuthRepository: AuthRepository) {}

  @Command({
    command: 'create:user',
    describe: 'create a user',
  })
  async create() {
    const user = await this.AuthRepository.createUser({
      fullName: 'Last name',
      phoneNumber: '999999999',
      email: 'test@test.com',
      password: 'foo_b@r',
    });
    console.log(user);
  }
}
