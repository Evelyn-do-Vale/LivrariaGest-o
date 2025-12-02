import { dbPromisse } from "../bd";
import { CompraLivro } from "../Modells/int_CompraLivro";

export default class CompraLivroRepo {

    static async create(item: CompraLivro) {
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO compra_livro (id_compra, id_livro, quantidade, preco)  
             VALUES (?, ?, ?, ?)`,
            [
                item.id_compra,
                item.id_livro,
                item.quantidade,
                item.preco_unitario
            ]
        );

        return res.lastID;
    }

    static async findByCompra(id_compra: number) {
        const db = await dbPromisse;

        return db.all<CompraLivro[]>(
            `SELECT * FROM compra_livro WHERE id_compra = ?`,
            [id_compra]
        );
    }

    static async deleteByCompra(id_compra: number) {
        const db = await dbPromisse;

        return db.run(
            `DELETE FROM compra_livro WHERE id_compra = ?`,
            [id_compra]
        );
    }
}