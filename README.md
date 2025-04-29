# Task Manager Frontend

Este é o frontend do sistema de gerenciamento de tarefas, desenvolvido em React. Ele permite que os usuários façam login, cadastrem-se, visualizem e gerenciem tarefas de suas equipes.

## Funcionalidades

### Usuário e Autenticação
- Cadastro de usuário com associação a uma equipe.
- Login com autenticação JWT.
- Cada usuário pertence a uma única equipe.
- Usuário pode visualizar e gerenciar apenas tarefas da sua equipe.

### Tarefas
- Criar tarefas com:
  - Título
  - Descrição
  - Data limite
  - Status (Pendente, Em andamento, Concluída)
  - Responsável
- Editar tarefas.
- Listar tarefas com filtros por:
  - Status
  - Membro da equipe
- Trocar status de uma tarefa.

### Frontend
- Tela de login e cadastro de usuário.
- Lista de tarefas da equipe.
- Formulário para criação e edição de tarefas.
- Filtros de tarefas por status e por membro da equipe.

## Tecnologias Utilizadas

- **React**: Biblioteca principal para construção da interface.
- **React Router DOM**: Para navegação entre as páginas.
- **Axios**: Para comunicação com o backend.
- **CSS**: Para estilização das páginas.

## Estrutura do Projeto
.gitignore LICENSE package.json README.md public/ favicon.ico index.html logo192.png logo512.png manifest.json robots.txt src/ api.js App.js index.js components/ Login.js Register.js TaskForm.js TaskList.js styles/ Login.css Register.css TaskList.css



## Pré-requisitos

- Node.js (versão 14 ou superior)
- Gerenciador de pacotes npm ou yarn

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/RooseveltAndrade/taskmanager_front_end.git
   cd taskmanager-frontend
2. Instale as dependências:
   npm install
3.Inicie o servidor de desenvolvimento:
   npm start
4.Acesse o aplicativo no navegador:
  http://localhost:3000

Decisões de Projeto
React foi escolhido por sua popularidade, facilidade de uso e grande comunidade de suporte.
Axios foi utilizado para facilitar a comunicação com o backend, especialmente para lidar com autenticação JWT.
CSS puro foi utilizado para estilização, garantindo controle total sobre o design sem dependência de bibliotecas externas.
Licença
Este projeto está licenciado sob a MIT License. ```
