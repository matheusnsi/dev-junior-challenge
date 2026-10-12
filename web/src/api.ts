import { API_URL } from './config';
import type { Checkin } from './types';

export async function listarCheckins(): Promise<Checkin[]> {
  const resposta = await fetch(`${API_URL}/checkins`);

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar a fila.');
  }

  return resposta.json();
}

export async function criarCheckin(cpf: string): Promise<Checkin> {
  const resposta = await fetch(`${API_URL}/checkins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpf }),
  });

  if (!resposta.ok) {
    throw new Error('Não foi possível fazer o check-in.');
  }

  return resposta.json();
}