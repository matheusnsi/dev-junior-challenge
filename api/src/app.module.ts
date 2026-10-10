import { Module } from '@nestjs/common';
import { CheckinsModule } from './checkins/checkins.module';

@Module({
  imports: [CheckinsModule],
})
export class AppModule {}
