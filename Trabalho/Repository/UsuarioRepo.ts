import { dbPromisse } from "../bd";
import Usuario from "../Modells/int_usuario";

export default class UsuarioRepo {static async create(usuario: Usuario) {
        const db = await dbPromisse;
        const res = await db.run(
        `INSERT INTO usuarios (nome, email, senha, data_criacao) VALUES (?, ?, ?, ?)`,
            [usuario.nome, 
            usuario.email, 
            usuario.senha ?? null, 
            usuario.data_criacao.toLocaleDateString("pt-BR")]
        );
        usuario.id = res.lastID;
        return res;
    }

    static async findAll() {
        const db = await dbPromisse;
        return db.all<Usuario[]>(`SELECT * FROM usuarios`);
    }

    static async findById(id: number) {
        const db = await dbPromisse;
        return db.get<Usuario>(`SELECT * FROM usuarios WHERE id = ?`, [id]);
    }

    static async findByEmail(email: string) {
        const db = await dbPromisse;
        return db.get<Usuario>(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    }

    static async update(id: number, usuario: Partial<Usuario>) {
        const db = await dbPromisse;
        const row = await db.get(`SELECT * FROM usuarios WHERE id = ?`, [id]);
        if (!row) return null;
        const nome = usuario.nome ?? row.nome;
        const email = usuario.email ?? row.email;
        const senha = usuario.senha ?? row.senha;
        const data_criacao = usuario.data_criacao ? usuario.data_criacao.toISOString() : row.data_criacao;
        const res = await db.run(
        `UPDATE usuarios SET nome = ?, email = ?, senha = ?, data_criacao = ? WHERE id = ?`,
        [nome, email, senha, data_criacao, id]
        );
        return res.changes;
    }

    static async delete(id: number) {
        const db = await dbPromisse;
        return db.run(`DELETE FROM usuarios WHERE id = ?`, [id]);
    }
}