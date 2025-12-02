import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const dbPromisse = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database
});

export async function initDB() {
    const db = await dbPromisse;
    await db.exec("PRAGMA foreign_keys = ON;");

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            senha TEXT NOT NULL,
            data_criacao TEXT NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            acao TEXT NOT NULL,
            data_hora TEXT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            genero TEXT NOT NULL,
            preco REAL NOT NULL,
            quantidade INTEGER NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            CPF TEXT NOT NULL,
            email TEXT NOT NULL,
            senha TEXT NOT NULL,
            cargo TEXT NOT NULL,
            data_contrato TEXT NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER,
            id_livro INTEGER,
            id_funcionario INTEGER,
            metodo TEXT NOT NULL,
            valor_total REAL NOT NULL,
            data TEXT,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
            FOREIGN KEY (id_livro) REFERENCES livros(id) ON DELETE SET NULL,
            FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id) ON DELETE SET NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS boletos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_compra INTEGER NOT NULL,
            data_emissao TEXT NOT NULL,
            data_vencimento TEXT NOT NULL,
            data_pagamento TEXT,
            valor REAL NOT NULL,
            FOREIGN KEY (id_compra) REFERENCES vendas(id)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS autores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS autor_livro (
            id_autor INTEGER NOT NULL,
            id_livro INTEGER NOT NULL,
            PRIMARY KEY (id_autor, id_livro),
            FOREIGN KEY (id_autor) REFERENCES autores(id) ON DELETE CASCADE,
            FOREIGN KEY (id_livro) REFERENCES livros(id) ON DELETE CASCADE
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS compra_livro (
            id_compra INTEGER NOT NULL,
            id_livro INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_unitario REAL NOT NULL,
            PRIMARY KEY (id_compra, id_livro),
            FOREIGN KEY (id_compra) REFERENCES vendas(id) ON DELETE CASCADE,
            FOREIGN KEY (id_livro) REFERENCES livros(id) ON DELETE CASCADE
        );
    `);
}