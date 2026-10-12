import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { criarCheckin } from '../api';
import type { Checkin } from '../types';
import { formatarCpf } from '../utils/cpf.ts';

interface FormularioCheckinProps {
  aoRealizarCheckin: (checkin: Checkin) => void;
}

function FormularioCheckin({ aoRealizarCheckin }: FormularioCheckinProps) {
  const [cpf, setCpf] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setSucesso(null);
    setEnviando(true);

    try {
      const checkin = await criarCheckin(cpf);
      aoRealizarCheckin(checkin);
      setSucesso(`Check-in realizado: ${checkin.nome}`);
      setCpf('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <label htmlFor="cpf">CPF</label>
      <input
        id="cpf"
        className="campo"
        value={cpf}
        onChange={(evento) => setCpf(formatarCpf(evento.target.value))}
        placeholder="000.000.000-00"
        inputMode="numeric"
        maxLength={14}
      />
      <button type="submit" className="botao" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Fazer check-in'}
      </button>

      {erro && (
        <p role="alert" className="mensagem mensagem-erro">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="mensagem mensagem-sucesso">
          {sucesso}
        </p>
      )}
    </form>
  );
}

export default FormularioCheckin;
