import { Injectable } from '@nestjs/common';
import { Checkin } from './interfaces/checkin.interface';

@Injectable()
export class CheckinsService {
  private readonly fila: Checkin[] = [];

  listar(): Checkin[] {
    return this.fila;
  }
}
