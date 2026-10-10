import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { CheckinsModule } from './checkins/checkins.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), CheckinsModule],
})
export class AppModule {}
