import { bancoPronto, dbPromisse } from "../bd";

export default class AutorLivroService {

    static async vincular(id_autor: number, id_livro: number) {
        await bancoPronto;
        const db = await dbPromisse;

        await db.run(
            `INSERT INTO autor_livro (id_autor, id_livro) VALUES (?, ?)`,
            [id_autor, id_livro]
        );

        return { id_autor, id_livro };
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all(
            `SELECT * FROM autor_livro`
        );
    }

    static async buscarPorLivro(id_livro: number) {
        const db = await dbPromisse;
        return db.all(
            `SELECT * FROM autor_livro WHERE id_livro = ?`,
            [id_livro]
        );
    }

    static async buscarPorAutor(id_autor: number) {
        const db = await dbPromisse;
        return db.all(
            `SELECT * FROM autor_livro WHERE id_autor = ?`,
            [id_autor]
        );
    }

    static async remover(id_autor: number, id_livro: number) {
        const db = await dbPromisse;

        return db.run(
            `DELETE FROM autor_livro WHERE id_autor = ? AND id_livro = ?`,
            [id_autor, id_livro]
        );
    }
}
