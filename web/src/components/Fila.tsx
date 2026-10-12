import type { Checkin } from '../types';

interface FilaProps {
  checkins: Checkin[];
}

function Fila({ checkins }: FilaProps) {
  if (checkins.length === 0) {
    return <p>Nenhum check-in até agora.</p>;
  }

  return (
    <ol>
      {checkins.map((checkin) => (
        <li key={checkin.id}>
          {checkin.nome} - chegada às{' '}
          {new Date(checkin.chegadaEm).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </li>
      ))}
    </ol>
  );
}

export default Fila;