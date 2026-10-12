import { API_URL } from './config';
import type { Checkin } from './types';

export async function listarCheckins(): Promise<Checkin[]> {
  const resposta = await fetch(`${API_URL}/checkins`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar a fila.');
  }

  return resposta.json();
}