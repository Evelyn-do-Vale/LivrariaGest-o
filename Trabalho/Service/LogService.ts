import { bancoPronto, dbPromisse } from "../bd";
import Log from "../Modells/int_Log";

export default class LogService {

    static async create(id_cliente: number | null, acao: string) {
        await bancoPronto;
        const db = await dbPromisse;

        const data_hora = new Date().toLocaleDateString("pt-BR");

        const res = await db.run(
            `INSERT INTO logs (cliente_id, acao, data_hora) VALUES (?, ?, ?)`,
            [id_cliente, acao, data_hora]
        );

        return res.lastID;
    }

    static async findAll(): Promise<Log[]> {
        const db = await dbPromisse;

        return db.all<Log[]>(
            `SELECT * FROM logs ORDER BY id DESC`
        );
    }

    static async findByCliente(cliente_id: number): Promise<Log[]> {
        const db = await dbPromisse;

        return db.all<Log[]>(
            `SELECT * FROM logs WHERE cliente_id = ? ORDER BY id DESC`,
            [cliente_id]
        );
    }
}