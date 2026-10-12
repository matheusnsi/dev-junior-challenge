import { API_URL } from './config';
import type { Checkin } from './types';

async function lerMensagemDeErro(
  resposta: Response,
  mensagemPadrao: string,
): Promise<string> {
  try {
    const corpo = await resposta.json();

    if (Array.isArray(corpo.message)) {
      return corpo.message[0];
    }

    if (typeof corpo.message === 'string') {
      return corpo.message;
    }
  } catch {
    // a resposta não era JSON
  }

  return mensagemPadrao;
}

async function requisitar<T>(
  caminho: string,
  mensagemPadrao: string,
  opcoes?: RequestInit,
): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
  }

  if (!resposta.ok) {
    throw new Error(await lerMensagemDeErro(resposta, mensagemPadrao));
  }

  return resposta.json();
}

export function listarCheckins(): Promise<Checkin[]> {
  return requisitar<Checkin[]>('/checkins', 'Não foi possível carregar a fila.');
}

export function criarCheckin(cpf: string): Promise<Checkin> {
  return requisitar<Checkin>('/checkins', 'Não foi possível fazer o check-in.', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpf }),
  });
}