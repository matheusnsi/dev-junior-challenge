# Entrega - Matheus Silveira

## Como rodar

### Opção 1: Docker (recomendado)
Pré-requisito: Docker Desktop.

Na raiz do projeto:
```
docker compose up --build
```
Abra `http://localhost:5173`.

Sobe tudo junto: serviço de cadastro (porta 4000), banco PostgreSQL (5432), API (3000) e front-end (5173). A API só inicia depois que o banco está pronto.

Para parar, use `Ctrl+C` ou `docker compose down`. Os check-ins ficam salvos no volume do banco. Para apagar tudo, use `docker compose down -v`.

### Opção 2: Rodando localmente
Pré-requisitos: Node.js 24 ou superior e Docker Desktop (só para o banco e o cadastro).

**1. Banco e serviço de cadastro.** Na raiz:
```
docker compose up -d db mock-service
```

**2. API.** Em outro terminal:
```
cd api
npm install
copy .env.example .env
npm run start:dev
```
A API sobe em `http://localhost:3000`.

- `GET /checkins` - lista a fila do dia
- `POST /checkins` - cria um check-in. Corpo: `{ "cpf": "11111111111" }`

**3. Front-end.** Em outro terminal:
```
cd web
npm install
copy .env.example .env
npm run dev
```
Abre em `http://localhost:5173`.

No Linux ou macOS, use `cp .env.example .env` no lugar do `copy`.

Se houver um PostgreSQL instalado na máquina usando a porta 5432, pare esse serviço antes. Senão a API conecta nele em vez do banco do Docker.

### Testes
```
cd api
npm install
npm test
```

## O que foi feito

### API
- API em NestJS com os dois endpoints pedidos: criar check-in e listar a fila.
- Ao criar o check-in, a API consulta o serviço de cadastro para buscar o nome do paciente pelo CPF.
- Check-ins guardados no PostgreSQL. A listagem traz só os check-ins do dia.
- Validação do CPF na entrada: aceita 11 dígitos, com ou sem pontuação.
- Respostas de erro claras:
  - **400** quando o CPF está vazio ou fora do formato
  - **404** quando o CPF não existe no cadastro
  - **502** quando o serviço de cadastro está fora do ar ou demora mais de 5 segundos
- CORS habilitado para o front-end conseguir chamar a API.

### Front-end
- Tela em React com o formulário de check-in e a fila ao lado.
- Máscara no campo de CPF enquanto a pessoa digita, aceitando só números.
- Depois do check-in, o paciente entra na fila na hora, sem recarregar a página.
- Mensagens na tela para cada situação: check-in realizado, CPF inválido, CPF não encontrado, cadastro fora do ar e API fora do ar.
- Botão desativado enquanto o check-in está sendo enviado.
- Layout que se adapta a telas menores.

### Testes e Docker
- Teste unitário do `CheckinsService` cobrindo o check-in com sucesso e o CPF não encontrado.
- Dockerfile para a API e para o front-end. O `docker compose up` sobe o projeto inteiro.

## Onde guardei os dados
No PostgreSQL.

Comecei guardando em memória, numa lista dentro do `CheckinsService`, para focar no fluxo principal. Com o fluxo pronto, troquei pelo banco, porque em memória os check-ins se perdiam quando a API reiniciava.

- **SQL escrito à mão com o driver `pg`, sem ORM.** São uma tabela e duas consultas, então um ORM traria mais configuração do que ganho. Assim também fica claro o que vai para o banco.
- **Tabela criada quando a API sobe**, com `CREATE TABLE IF NOT EXISTS`. Quem for rodar não precisa executar nenhum script.
- **Conexão concentrada no `DatabaseService`.** Ele cuida do pool de conexões. O `CheckinsService` só escreve as consultas.
- **Consultas com parâmetros** (`$1`, `$2`...). O valor nunca é colado direto no SQL, o que evita SQL injection.
- **Horário salvo com fuso** (`TIMESTAMPTZ`, em UTC). A listagem filtra a fila do dia pelo fuso de São Paulo, e o front mostra o horário local.
- **Endereço do banco em variável de ambiente** (`DATABASE_URL`), igual ao do cadastro.

## Decisões e dificuldades

### Ordem de trabalho
Decidi construir primeiro o fluxo principal de ponta a ponta (API -> integração com o cadastro -> tela) e só depois partir para os itens desejáveis: testes, Docker e banco de dados. A ideia foi garantir um núcleo funcionando antes de qualquer opcional.

Estrutura:
- `api/` - API em NestJS (porta 3000)
- `web/` - front-end em React (porta 5173)
- `mock-service/` - serviço de cadastro fornecido (porta 4000), sem alterações

### Uso de IA
Usei o Claude como apoio durante o desafio: para planejar a ordem do trabalho, entender conceitos do NestJS e do PostgreSQL, tirar dúvidas sobre o código e investigar erros. Escrevi o código no meu editor, revisando cada trecho antes de commitar, e só segui adiante quando entendia o que cada parte fazia.

### Decisões da API
- **Integração separada em um módulo próprio.** Criei o `CadastroService` só para conversar com o serviço de cadastro. O `CheckinsService` fica com a regra da fila. Se o cadastro mudar, só o `CadastroService` precisa mudar.
- **Endereço do cadastro em variável de ambiente** (`CADASTRO_URL`). Assim o mesmo código funciona na minha máquina, no Docker ou apontando para outro ambiente. Usei o `getOrThrow` para a API nem subir se a variável estiver faltando.
- **Validação só do formato do CPF**, sem conferir os dígitos verificadores. Os CPFs de teste do mock (como `11111111111`) seriam recusados por uma validação completa.
- **CPF sem pontuação antes de consultar.** A entrada aceita `111.111.111-11`, mas a API remove os pontos e o hífen antes de consultar o cadastro e guardar, para o mesmo CPF ficar sempre igual.
- **404 e 502 separados.** CPF que não existe é uma resposta normal do cadastro (404). Cadastro fora do ar ou com erro é falha do serviço externo (502). Separar ajuda quem usa a tela a entender o que aconteceu.
- **Timeout de 5 segundos** na chamada ao cadastro, para o totem não ficar esperando para sempre se o serviço travar.
- **CORS liberado para qualquer origem**, por ser um ambiente local. Em produção, eu restringiria ao endereço do front-end.
- **Check-in repetido permitido.** Não bloqueei o mesmo CPF fazendo check-in mais de uma vez.
- **CommonJS com Jest** ao criar o projeto, por ser o padrão mais comum em projetos NestJS e por eu já ter estudado Jest.
- **Nomes em português** (`nome`, `chegadaEm`), seguindo o enunciado e o serviço de cadastro.

### Decisões do front-end
- **Vite com React e TypeScript**, e ESLint por ser o padrão em projetos React e já trazer as regras de hooks.
- **Endereço da API em variável de ambiente** (`VITE_API_URL`), com `http://localhost:3000` como valor padrão, para funcionar mesmo sem o `.env`.
- **Chamadas à API concentradas no `api.ts`.** As duas chamadas passam por uma função só, que trata a API fora do ar e lê a mensagem de erro que a API devolve.
- **Mensagens da própria API na tela.** O front mostra o texto que a API devolveu (por exemplo, "Paciente não encontrado"), em vez de uma mensagem genérica.
- **Fila atualizada sem buscar de novo.** Depois do check-in, adiciono na lista o que a API devolveu. É mais rápido, mas com dois totens um não veria o check-in do outro sem recarregar.
- **CPF fora da fila.** A lista mostra só nome e horário, porque uma tela de recepção fica visível para quem passa.
- **Máscara de CPF sem biblioteca**, com uma função pequena em `utils/cpf.ts`.
- **CSS puro, sem biblioteca de componentes.**

### Decisões de testes e Docker
- **Teste no `CheckinsService`**, porque é onde está a regra principal. O cadastro e o banco são simulados (mocks), então o teste roda sem nenhum serviço no ar.
- **Dockerfiles em duas etapas.** A primeira compila o projeto e a segunda leva só o necessário para rodar, deixando a imagem menor. O front-end é servido pelo nginx.
- **API espera o banco ficar pronto.** O banco tem um healthcheck, e a API só sobe depois que ele responde. Sem isso, a API poderia iniciar antes do Postgres e cair.
- **Nomes dos serviços dentro do Docker.** A API acessa o cadastro e o banco por `mock-service` e `db`. O navegador continua usando `localhost:3000`, porque roda fora do Docker.

### Dificuldades
- **Arquivo de build no Git.** Ao criar o projeto, o TypeScript gerou um arquivo `.tsbuildinfo`. Percebi antes de commitar e adicionei ao `.gitignore`.
- **Scripts quebrados depois da limpeza.** Removi os testes de exemplo do NestJS, mas os scripts `format` e `lint` ainda apontavam para a pasta `test`. Corrigi em um commit separado.
- **Chaves no `try/catch`.** Ao tratar o cadastro fora do ar, uma chave fechou o método antes da hora e o código ficou fora da função. Encontrei pelos erros do editor e corrigi.
- **Tipo do evento do formulário.** O `FormEvent` aparecia como obsoleto na versão nova do React. Troquei pelo `SubmitEvent`, que o próprio editor sugeriu.
- **Aspas diferentes entre as pastas.** O front não tinha configuração do Prettier e começou a formatar com aspas duplas. Criei um `.prettierrc` igual ao da API para manter o mesmo padrão.
- **Jest com o NestJS 12.** O teste não rodava. Primeiro, o TypeScript exigiu o `rootDir` no `tsconfig.json`. Depois, o Jest não conseguia carregar o NestJS 12, que é distribuído como ES Module. Atualizei o Node para a versão 24 e passei a rodar o Jest com `--experimental-vm-modules` nos scripts de teste.
- **Instalação do Docker.** A primeira instalação falhou porque o recurso de máquina virtual do Windows estava desativado. Reinstalei com o WSL. Também nomeei um arquivo como `DockerFile` e o Docker não encontrou, porque o Linux diferencia maiúsculas de minúsculas.
- **Porta do banco ocupada.** A API dava erro de senha para o usuário `desafio`. A mensagem estava em português, mas o Postgres do Docker responde em inglês. Assim descobri que a API estava conectando no PostgreSQL instalado no meu computador, que usava a mesma porta 5432. Parei o serviço local e a API passou a usar o banco do Docker.

## O que faria com mais tempo
- Validar a resposta do serviço de cadastro, em vez de só confiar no formato.
- Restringir o CORS ao endereço do front-end.
- Atualizar a fila automaticamente de tempos em tempos, para vários totens verem os mesmos check-ins.
- Testes de integração da API com o banco e testes no front-end.
- Migrations versionadas no lugar do `CREATE TABLE` na inicialização.
- Bloquear check-in repetido do mesmo CPF no mesmo dia, se a regra do hospital pedir.