import type { Checkin } from '../types';

interface FilaProps {
  checkins: Checkin[];
}

function Fila({ checkins }: FilaProps) {
  if (checkins.length === 0) {
    return <p>Nenhum check-in até agora.</p>;
  }

    if (checkins.length === 0) {
    return <p className="aviso">Nenhum check-in até agora.</p>;
  }

  return (
    <ol className="fila">
      {checkins.map((checkin, indice) => (
        <li key={checkin.id} className="fila-item">
          <span>
            <strong>{indice + 1}.</strong> {checkin.nome}
          </span>
          <span className="horario">
            {new Date(checkin.chegadaEm).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default Fila;