import { useEffect, useState } from 'react';
import { listarCheckins } from './api';
import Fila from './components/Fila';
import FormularioCheckin from './components/FormularioCheckin';
import type { Checkin } from './types';

function App() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroFila, setErroFila] = useState<string | null>(null);

  useEffect(() => {
    listarCheckins()
      .then(setCheckins)
      .catch((erro: Error) => setErroFila(erro.message))
      .finally(() => setCarregando(false));
  }, []);

  function adicionarNaFila(checkin: Checkin) {
    setCheckins((atual) => [...atual, checkin]);
  }

  return (
    <main>
      <h1>Check-in de pacientes</h1>
      <FormularioCheckin aoRealizarCheckin={adicionarNaFila} />
      <h2>Fila</h2>
      {carregando && <p>Carregando fila...</p>}
      {erroFila && <p role="alert">{erroFila}</p>}
      {!carregando && !erroFila && <Fila checkins={checkins} />}
    </main>
  );
}

export default App;
