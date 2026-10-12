import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { criarCheckin } from '../api';
import type { Checkin } from '../types';

interface FormularioCheckinProps {
  aoRealizarCheckin: (checkin: Checkin) => void;
}

function FormularioCheckin({ aoRealizarCheckin }: FormularioCheckinProps) {
  const [cpf, setCpf] = useState('');

  async function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    const checkin = await criarCheckin(cpf);
    aoRealizarCheckin(checkin);
    setCpf('');
  }

  return (
    <form onSubmit={enviar}>
      <label htmlFor="cpf">CPF</label>
      <input
        id="cpf"
        value={cpf}
        onChange={(evento) => setCpf(evento.target.value)}
        placeholder="00000000000 ou 000.000.000-00"
        inputMode="numeric"
        maxLength={14}
      />
      <button type="submit">Fazer check-in</button>
    </form>
  );
}

export default FormularioCheckin;