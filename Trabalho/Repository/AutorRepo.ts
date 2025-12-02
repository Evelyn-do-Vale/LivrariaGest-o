import { dbPromisse } from "../bd";
import Autor from "../Modells/int_autor";


export default class AutorRepo {
    static async create(autor: Autor) {
        const db = await dbPromisse;
        const res = await db.run(
        `INSERT INTO autores (nome) VALUES (?)`,
        [autor.nome]
        );
        autor.id = res.lastID;
        return res;
    }

    static async findAll() {
        const db = await dbPromisse;
        return db.all<Autor[]>(`SELECT * FROM autores`);
    }

    static async findById(id: number) {
        const db = await dbPromisse;
        return db.get<Autor>(`SELECT * FROM autores WHERE id = ?`, [id]);
    }

    static async update(id: number, autor: Partial<Autor>) {
        const db = await dbPromisse;
        const row = await db.get(`SELECT * FROM autores WHERE id = ?`, [id]);
        if (!row) return null;
        const nome = autor.nome ?? row.nome;
        const res = await db.run(`UPDATE autores SET nome = ? WHERE id = ?`, [nome, id]);
        return res.changes;
    }

    static async delete(id: number) {
        const db = await dbPromisse;
        return db.run(`DELETE FROM autores WHERE id = ?`, [id]);
    }
}