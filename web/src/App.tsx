import { useEffect, useState } from 'react';
import { listarCheckins } from './api';
import Fila from './components/Fila';
import FormularioCheckin from './components/FormularioCheckin';
import type { Checkin } from './types';

function App() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  useEffect(() => {
    listarCheckins().then(setCheckins);
  }, []);

  function adicionarNaFila(checkin: Checkin) {
    setCheckins((atual) => [...atual, checkin]);
  }

  return (
    <main>
      <h1>Check-in de pacientes</h1>
      <FormularioCheckin aoRealizarCheckin={adicionarNaFila} />
      <h2>Fila</h2>
      <Fila checkins={checkins} />
    </main>
  );
}

export default App;