import { bancoPronto, dbPromisse } from "../bd";
import Livros from "../Modells/int_livro";
import LogService from "./LogService";

export default class LivroService {

    static async criar(livro: Livros, id_cliente: number | null = null) {
        await bancoPronto;
        const db = await dbPromisse;

        const jaExiste = await db.get(
            `SELECT id FROM livros WHERE titulo = ?`,
            [livro.titulo]
        );

        if (jaExiste) {
            livro.id = jaExiste.id;
            return livro;
        }

        const res = await db.run(
            `INSERT INTO livros (titulo, genero, preco, quantidade)
             VALUES (?, ?, ?, ?)`,
            [
                livro.titulo,
                livro.genero,
                livro.preco,
                livro.quantidade
            ]
        );

        livro.id = res.lastID;

        await LogService.create(id_cliente, `Criou livro id=${livro.id} titulo=${livro.titulo}`);

        return livro;
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all<Livros[]>(`SELECT * FROM livros`);
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get<Livros>(`SELECT * FROM livros WHERE id = ?`, [id]);
    }

    static async atualizar(id: number, dados: Partial<Livros>, id_cliente: number | null = null) {
        const db = await dbPromisse;

        const row = await db.get(`SELECT * FROM livros WHERE id = ?`, [id]);
        if (!row) return null;

        const titulo = dados.titulo ?? row.titulo;
        const genero = dados.genero ?? row.genero;
        const preco = dados.preco ?? row.preco;
        const quantidade = dados.quantidade ?? row.quantidade;

        const res = await db.run(
            `UPDATE livros
             SET titulo = ?, genero = ?, preco = ?, quantidade = ?
             WHERE id = ?`,
            [titulo, genero, preco, quantidade, id]
        );

        if (res.changes) {
            await LogService.create(id_cliente, `Atualizou livro id=${id}`);
        }

        return res.changes;
    }

    static async remover(id: number, id_cliente: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(`DELETE FROM livros WHERE id = ?`, [id]);

        await LogService.create(id_cliente, `Excluiu livro id=${id}`);

        return res;
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