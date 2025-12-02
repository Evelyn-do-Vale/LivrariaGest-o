import { dbPromisse } from "../bd";
import { Compra } from "../Modells/int_Compra";

export default class VendaRepo {
    static async create(venda: Compra) {
        const db = await dbPromisse;
        const res = await db.run(
        `INSERT INTO vendas (id_usuario, id_funcionario, metodo, valor_total, data) VALUES (?, ?, ?, ?, ?)`,
            [venda.id_usuario, 
            venda.id_funcionario, 
            venda.metodo, 
            venda.valor_total, 
            venda.data]
        );
        return res.lastID;
    }

    static async findAll() {
    const db = await dbPromisse;
    return db.all<Compra[]>(`SELECT * FROM vendas`);
    }

    static async findById(id: number) {
    const db = await dbPromisse;
    return db.get<Compra>(`SELECT * FROM vendas WHERE id = ?`, [id]);
    }
}