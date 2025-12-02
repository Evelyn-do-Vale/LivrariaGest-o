import BaseRepo from "./BaseRepo";
import Usuario from "../Modells/int_Usuario";

export default class UsuarioRepo extends BaseRepo {

    async criarUsuario(u: Usuario) {
        await this.db.run(
            'INSERT INTO Usuarios (id, nome, email, senha, data_criacao) VALUES (?, ?, ?, ?, ?)',
            [u.id, u.nome, u.email, u.senha, u.dataCriaUser]
        );

        return u;
    }

    async findByEmail(email: string) {
        return await this.db.get(
            'SELECT * FROM Usuarios WHERE email = ?',
            [email]
        );
    }

    async findById(id: string) {
        return await this.db.get(
            'SELECT * FROM Usuarios WHERE id = ?',
            [id]
        );
    }

    async all() {
        return await this.db.all(
            'SELECT id, nome, email, data_criacao FROM Usuarios'
        );
    }

    async update(id: string, changes: Partial<Usuario>) {
        const u = await this.findById(id);
        if (!u) return null;

        await this.db.run(
            'UPDATE Usuarios SET nome = ?, email = ? WHERE id = ?',
            [
                changes.nome ?? u.nome,
                changes.email ?? u.email,
                id
            ]
        );

        return await this.findById(id);
    }

    async delete(id: string) {
        return await this.db.run(
            'DELETE FROM Usuarios WHERE id = ?',
            [id]
        );
    }
}