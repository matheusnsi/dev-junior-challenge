import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CriarCheckinDto {
  @IsNotEmpty({ message: 'O campo "cpf" é obrigatório.' })
  @IsString({ message: 'O campo "cpf" deve ser um texto.' })
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
    message: 'CPF inválido. Informe 11 dígitos.',
  })
  cpf: string;
}
