import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeeder } from './user.seeder';

import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [CommandModule, AuthModule],
  providers: [UserSeeder, AuthModule],
  exports: [UserSeeder],
})
export class SeederModule {}
