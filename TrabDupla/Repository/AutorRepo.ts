import BaseRepo from "./BaseRepo";

export default class AutorRepo extends BaseRepo {

    async criarAutor(a: { id: string; nome: string }) {
        await this.db.run(
            `INSERT INTO autores (id, nome) VALUES (?, ?)`,
            [a.id, a.nome]
        );
        return a;
    }

    async all() {
        return this.db.all(`SELECT * FROM autores`);
    }

    async findById(id: string) {
        return this.db.get(
            `SELECT * FROM autores WHERE id = ?`,
            [id]
        );
    }

    async delete(id: string) {
        await this.db.run(
            `DELETE FROM autores WHERE id = ?`,
            [id]
        );
    }
}