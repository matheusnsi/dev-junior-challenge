import { Controller, Get } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { Checkin } from './interfaces/checkin.interface';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Get()
  listar(): Checkin[] {
    return this.checkinsService.listar();
  }
}
