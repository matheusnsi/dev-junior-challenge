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
    <div className="pagina">
      <header className="cabecalho">
        <h1>Check-in de pacientes</h1>
        <p>Informe o CPF para entrar na fila de atendimento.</p>
      </header>

      <main className="conteudo">
        <section className="cartao">
          <h2>Fazer check-in</h2>
          <FormularioCheckin aoRealizarCheckin={adicionarNaFila} />
        </section>

        <section className="cartao">
          <h2>
            Fila <span className="contador">{checkins.length}</span>
          </h2>
          {carregando && <p className="aviso">Carregando fila...</p>}
          {erroFila && (
            <p role="alert" className="mensagem mensagem-erro">
              {erroFila}
            </p>
          )}
          {!carregando && !erroFila && <Fila checkins={checkins} />}
        </section>
      </main>
    </div>
  );
}

export default App;
