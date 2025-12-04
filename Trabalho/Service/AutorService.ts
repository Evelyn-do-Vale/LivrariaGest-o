import { bancoPronto, dbPromisse } from "../bd";
import LogService from "./LogService";
import Autor from "../Modells/int_autor";

export default class AutorService {

    static async criar(autor: Autor, clienteId: number | null = null) {
        await bancoPronto;
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO autores (nome) VALUES (?)`,
            [autor.nome]
        );

        autor.id = res.lastID;

        await LogService.create(clienteId, `Criou autor id=${autor.id} nome=${autor.nome}`);
        return autor;
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all<Autor[]>(`SELECT * FROM autores`);
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get<Autor>(`SELECT * FROM autores WHERE id = ?`, [id]);
    }

    static async atualizar(id: number, dados: Partial<Autor>, clienteId: number | null = null) {
        const db = await dbPromisse;

        const row = await db.get(`SELECT * FROM autores WHERE id = ?`, [id]);
        if (!row) return null;

        const novoNome = dados.nome ?? row.nome;

        const res = await db.run(
            `UPDATE autores SET nome = ? WHERE id = ?`,
            [novoNome, id]
        );

        if (res.changes)
            await LogService.create(clienteId, `Atualizou autor id=${id}`);

        return res.changes;
    }

    static async remover(id: number, clienteId: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(
            `DELETE FROM autores WHERE id = ?`,
            [id]
        );

        await LogService.create(clienteId, `Excluiu autor id=${id}`);
        return res;
    }
}