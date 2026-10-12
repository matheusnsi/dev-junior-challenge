import { Module } from '@nestjs/common';
import { CadastroModule } from '../cadastro/cadastro.module';
import { DatabaseModule } from '../database/database.module';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';

@Module({
  imports: [CadastroModule, DatabaseModule],
  controllers: [CheckinsController],
  providers: [CheckinsService],
})
export class CheckinsModule {}