import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { Checkin } from './interfaces/checkin.interface';
import { CriarCheckinDto } from './dto/criar-checkin.dto';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

    @Get()
  listar(): Promise<Checkin[]> {
    return this.checkinsService.listar();
  }

  @Post()
  criar(@Body() dados: CriarCheckinDto): Promise<Checkin> {
    return this.checkinsService.criar(dados.cpf);
  }
}
