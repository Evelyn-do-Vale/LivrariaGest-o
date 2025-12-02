import { dbPromisse } from "../bd";
import Livros from "../Modells/int_livro";

export default class LivroRepo {

    static async create(livro: Livros) {
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO livros (titulo, genero, preco, quantidade) VALUES (?, ?, ?, ?)`,
                [livro.titulo, 
                livro.genero, 
                livro.preco, 
                livro.quantidade]
        );

        livro.id = res.lastID;
        return res;
    }

    static async findAll() {
        const db = await dbPromisse;
        return db.all<Livros[]>(`SELECT * FROM livros`);
    }

    static async findById(id: number) {
        const db = await dbPromisse;
        return db.get<Livros>(`SELECT * FROM livros WHERE id = ?`, [id]);
    }

    static async update(id: number, livro: Partial<Livros>) {
        const db = await dbPromisse;
        const row = await db.get(`SELECT * FROM livros WHERE id = ?`, [id]);
        if (!row) return null;

        const titulo = livro.titulo ?? row.titulo;
        const genero = livro.genero ?? row.genero;
        const preco = livro.preco ?? row.preco;
        const quantidade = livro.quantidade ?? row.quantidade;

        const res = await db.run(
            `UPDATE livros SET titulo = ?, genero = ?, preco = ?, quantidade = ? WHERE id = ?`,
            [titulo, genero, preco, quantidade, id]
        );

        return res.changes;
    }

    static async delete(id: number) {
        const db = await dbPromisse;
        return db.run(`DELETE FROM livros WHERE id = ?`, [id]);
    }

    static async diminuirEstoque(id: number, quantidade: number) {
        const db = await dbPromisse;

        const livro = await db.get<{ quantidade: number }>(
            `SELECT quantidade FROM livros WHERE id = ?`,
            [id]
        );

        if (!livro) throw new Error("Livro não encontrado");

        const atual = Number(livro.quantidade);
        const restante = atual - quantidade;

        if (restante < 0) {
            throw new Error("Estoque insuficiente");
        }

        await db.run(
            `UPDATE livros SET quantidade = ? WHERE id = ?`,
            [restante, id]
        );
    }
}