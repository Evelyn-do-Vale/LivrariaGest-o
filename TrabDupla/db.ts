import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const dbPromisse = await open({
    filename: "database.sqlite",
    driver: sqlite3.Database
})

export async function initDB() {
    const db = await dbPromisse;
    await db.exec("PRAGMA foreign_keys = ON;")
    await db.exec(`
    CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL,
        data_criacao DATE NOT NULL
        );

    CREATE TABLE IF NOT EXISTS Logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id TEXT NOT NULL,
        acao TEXT NOT NULL,
        data_hora TEXT NOT NULL,
        );

    CREATE TABLE IF NOT EXISTS Autores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
        );

    CREATE TABLE IF NOT EXISTS Livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        genero TEXT NOT NULL,
        preco NUMBER NOT NULL,
        );

    CREATE TABLE IF NOT EXISTS Livro_Autor (
        livro_id TEXT NOT NULL,
        autor-id TEXT NOT NULL,
        
        FOREIGN KEY (livro_id) REFERENCES Livros(id),
        FOREIGN KEY (autor_id) REFERENCES Autores(id)
        );

    CREATE TABLE IF NOT EXISTS Pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        data_pedido INTEGER,
        total REAL NOT NULL,
            
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
        );
    `)
            
}