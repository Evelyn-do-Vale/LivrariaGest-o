/*Tema: Sistema de Gestão (à escolha da dupla) livraria
Desenvolver uma aplicação em TypeScript com persistência de dados em SQLite, 
aplicando conceitos aprendidos na disciplina de Linguagem de programação, e boas práticas de código.
Requisitos mínimos:

1-Banco de dados SQLite com no mínimo 5 tabelas, sendo:
    + usuarios — com campos como id, nome, email, senha (criptografada), data_criacao;
    + logs — para registrar operações realizadas (ex: criação, exclusão, atualização);
    + pelo menos 3 tabelas relacionadas entre si, representando entidades do domínio escolhido.

2-Relacionamentos devem incluir pelo menos:
    + Um relacionamento 1:N (ex: um usuário pode ter várias tarefas);
    + Um relacionamento N:N (ex: alunos matriculados em várias disciplinas).

3-CRUD completo (Create, Read, Update, Delete) para as entidades principais.

4-Registro automático de logs:
    +Cada operação relevante (ex: criação, exclusão, login, atualização) deve gerar um registro na tabela logs com:
        *id (gerado automaticamente),
        *usuario_id,
        *acao,
        *Data_hora.

5-Organização em camadas:
    +Model: modelo de dados;
    +Repository: código SQL para interagir com o banco de dados;
    +Service: regras de negócio;
    +Controller: entrada e saída de dados;

6-Interface CLI para interagir com a camada Controller.

Apresentação e entrega nos dias 1 e 04/12/2025.
Valor: 50 pontos.
*/