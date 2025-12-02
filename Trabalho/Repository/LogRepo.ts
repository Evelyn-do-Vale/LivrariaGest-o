import { dbPromisse } from "../bd";
import Log from "../Modells/int_Log";

export default class LogRepo {

    static async create(usuarioId: number | null, acao: string) {
        const db = await dbPromisse;

        const data_hora = new Date().toLocaleDateString("pt-BR");

        const res = await db.run(
            `INSERT INTO logs (usuario_id, acao, data_hora) VALUES (?, ?, ?)`,
            [usuarioId, acao, data_hora]
        );

        return res.lastID;
    }

    static async findAll(): Promise<Log[]> {
        const db = await dbPromisse;

        return db.all<Log[]>(
            `SELECT * FROM logs ORDER BY id DESC`
        );
    }

    static async findByUsuario(usuarioId: number): Promise<Log[]> {
        const db = await dbPromisse;

        return db.all<Log[]>(
            `SELECT * FROM logs WHERE usuario_id = ? ORDER BY id DESC`,
            [usuarioId]
        );
    }
}