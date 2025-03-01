# Aesthetics Platform

Este projeto é uma plataforma de agendamento e gerenciamento de serviços de estética facial e corporal. Ele é composto por um frontend em React, um backend em Node.js e um banco de dados MySQL. O projeto também utiliza Docker para facilitar a configuração e execução dos serviços.

## Estrutura do Projeto

- **frontend**: Contém o código do frontend em React.
  - **components**: Componentes reutilizáveis da interface do usuário.
  - **hooks**: Hooks personalizados para lógica de estado e efeitos.
  - **lib**: Funções utilitárias e bibliotecas.
  - **pages**: Páginas da aplicação.
  - **styles**: Arquivos de estilo, incluindo Tailwind CSS.
- **backend**: Contém o código do backend em Node.js.
  - **controllers**: Controladores que lidam com as requisições HTTP.
  - **models**: Modelos do Sequelize para interação com o banco de dados MySQL.
  - **routes**: Definições de rotas da API.
  - **middlewares**: Middlewares para validação, autenticação, etc.
  - **config**: Configurações da aplicação, incluindo variáveis de ambiente.
- **nginx**: Contém a configuração do NGINX para rotear as solicitações.
- **docker-compose.yml**: Arquivo de configuração do Docker Compose para orquestrar os serviços.
- **.env**: Arquivo de configuração de variáveis de ambiente.

## Pré-requisitos

- Docker
- Docker Compose

## Configuração

### Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```dotenv
MYSQL_ROOT_PASSWORD=senha
MYSQL_DATABASE=banco_de_dados
MYSQL_USER=usuario
MYSQL_PASSWORD=senha
JWT_SECRET=chave_secreta_jwt
```

## Executando o Projeto

Para iniciar os serviços, execute o seguinte comando:

```sh
docker-compose up --build
```

Isso irá construir e iniciar todos os serviços definidos no `docker-compose.yml`.

## Testes

### Backend

Para rodar os testes do backend, utilize o seguinte comando:

```sh
cd backend
npm test
```

### Frontend

Para rodar os testes do frontend, utilize o seguinte comando:

```sh
cd frontend
npm test
```

## Estrutura de Pastas

```plaintext
aesthetics-plataform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── index.js
│   └── package.json
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .env
└── README.md
```

