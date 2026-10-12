# Entrega — Matheus Silveira 

## Como rodar
_Passo a passo para subir o back-end e o front-end na minha máquina._

Pré-requisito: Node.js 20 ou superior (usei a versão 22).

### 1. Serviço de cadastro (mock)
```
cd mock-service
npm install
npm start
```
Sobe em `http://localhost:4000`.

### 2. API
Em outro terminal:
```
cd api
npm install
copy .env.example .env
npm run start:dev
```
No Linux ou macOS, use `cp .env.example .env` no lugar do `copy`.

A API sobe em `http://localhost:3000`.

- `GET /checkins` - lista a fila
- `POST /checkins` - cria um check-in. Corpo: `{ "cpf": "11111111111" }`

### 3. Front-end
Em outro terminal:
```
cd web
npm install
copy .env.example .env
npm run dev
```
Abre em `http://localhost:5173`. A API e o serviço de cadastro precisam estar rodando.


## O que foi feito
_Resumo do que está funcionando._

### API
- API em NestJS com os dois endpoints pedidos: criar check-in e listar a fila.
- Ao criar o check-in, a API consulta o serviço de cadastro para buscar o nome do paciente pelo CPF.
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

## Onde guardei os dados
_Usei banco de dados ou memória? Por quê?_

Guardei em memória, numa lista dentro do `CheckinsService`. Escolhi assim para focar primeiro no fluxo principal funcionando. Como o NestJS cria uma única instância do service enquanto a API está rodando, todas as requisições usam a mesma fila. A limitação é que os check-ins se perdem quando a API reinicia.

## Decisões e dificuldades
_Escolhas que fiz e pontos onde tive dúvida ou dificuldade._


### Ordem de Trabalho
Decidi construir primeiro o fluxo principal de ponta a ponta (API -> integração com o cadastro -> tela) e só depois partir para os itens desejáveis, como testes, Docker e banco de dados. A ideia é garantir um núcleo funcionando antes de qualquer opcional.

Estrutura planejada:
- `api/` - API em NestJS (porta 3000)
- `web/` - front-end em React (porta 5173)
- `mock-service/` - serviço de cadastro fornecido (porta 4000), sem alterações

### Decisões da API
- **Integração separada em um módulo próprio.** Criei o `CadastroService` só para conversar com o serviço de cadastro. O `CheckinsService` fica com a regra da fila. Se o cadastro mudar, só o `CadastroService` precisa mudar.
- **Endereço do cadastro em variável de ambiente** (`CADASTRO_URL`). Assim o mesmo código funciona na minha máquina, no Docker ou apontando para outro ambiente. Usei o `getOrThrow` para a API nem subir se a variável estiver faltando.
- **Validação só do formato do CPF**, sem conferir os dígitos verificadores. Os CPFs de teste do mock (como `11111111111`) seriam recusados por uma validação completa.
- **CPF sem pontuação antes de consultar.** A entrada aceita `111.111.111-11`, mas a API remove os pontos e o hífen antes de consultar o cadastro e guardar na fila, para o mesmo CPF ficar sempre igual.
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

### Dificuldades
- **Arquivo de build no Git.** Ao criar o projeto, o TypeScript gerou um arquivo `.tsbuildinfo`. Percebi antes de commitar e adicionei ao `.gitignore`.
- **Scripts quebrados depois da limpeza.** Removi os testes de exemplo do NestJS, mas os scripts `format` e `lint` ainda apontavam para a pasta `test`. Corrigi em um commit separado.
- **Chaves no `try/catch`.** Ao tratar o cadastro fora do ar, uma chave fechou o método antes da hora e o código ficou fora da função. Encontrei pelos erros do editor e corrigi.
- **Tipo do evento do formulário.** O `FormEvent` aparecia como obsoleto na versão nova do React. Troquei pelo `SubmitEvent`, que o próprio editor sugeriu.
- **Aspas diferentes entre as pastas.** O front não tinha configuração do Prettier e começou a formatar com aspas duplas. Criei um `.prettierrc` igual ao da API para manter o mesmo padrão.

## O que faria com mais tempo
_Próximos passos ou melhorias que ficaram de fora._
- Guardar os check-ins no PostgreSQL, para não perder a fila quando a API reinicia.
- Validar a resposta do serviço de cadastro, em vez de só confiar no formato.
- Restringir o CORS ao endereço do front-end.
- Atualizar a fila automaticamente de tempos em tempos, para vários totens verem os mesmos check-ins.
