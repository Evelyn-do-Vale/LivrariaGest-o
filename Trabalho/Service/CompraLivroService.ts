import { bancoPronto, dbPromisse } from "../bd";
import { CompraLivro } from "../Modells/int_CompraLivro";
import LogService from "./LogService";

export default class CompraLivroService {

    static async criar(item: CompraLivro, id_cliente: number | null = null) {
        await bancoPronto;
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO compra_livro 
                (id_compra, id_livro, quantidade, preco)  
             VALUES (?, ?, ?, ?)`,
            [
                item.id_compra,
                item.id_livro,
                item.quantidade,
                item.preco_unitario
            ]
        );

        await LogService.create(id_cliente, 
            `Criou item da compra venda=${item.id_compra} livro=${item.id_livro} qtd=${item.quantidade}`
        );

        return res.lastID;
    }

    static async listarPorCompra(id_compra: number) {
        const db = await dbPromisse;

        return db.all<CompraLivro[]>(
            `SELECT * FROM compra_livro WHERE id_compra = ?`,
            [id_compra]
        );
    }

    static async removerPorCompra(id_compra: number, id_cliente: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(
            `DELETE FROM compra_livro WHERE id_compra = ?`,
            [id_compra]
        );

        await LogService.create(id_cliente, `Removeu itens da compra id=${id_compra}`);

        return res;
    }
}
