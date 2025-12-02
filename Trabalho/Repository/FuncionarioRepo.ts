import { dbPromisse } from "../bd";
import Funcionario from "../Modells/int_funcionario";

export default class FuncionarioRepo {

    static async create(funcionario: Funcionario) {
        const db = await dbPromisse;
        const res = await db.run(
            `INSERT INTO funcionarios (nome, CPF, email, senha, cargo, data_contrato)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                funcionario.nome,
                funcionario.CPF,
                funcionario.email,
                funcionario.senha ?? null,
                funcionario.cargo,
                funcionario.data_contrato.toLocaleDateString("pt-BR")
            ]
        );
        funcionario.id = res.lastID;
        return res;
    }

    static async findAll() {
        const db = await dbPromisse;
        return db.all<Funcionario[]>(`SELECT * FROM funcionarios`);
    }

    static async findById(id: number) {
        const db = await dbPromisse;
        return db.get<Funcionario>(`SELECT * FROM funcionarios WHERE id = ?`, [id]);
    }

    static async findByEmail(email: string) {
        const db = await dbPromisse;
        return db.get<Funcionario>(`SELECT * FROM funcionarios WHERE email = ?`, [email]);
    }

    static async update(id: number, funcionario: Partial<Funcionario>) {
        const db = await dbPromisse;

        const row = await db.get(`SELECT * FROM funcionarios WHERE id = ?`, [id]);
        if (!row) return null;

        const nome = funcionario.nome ?? row.nome;
        const CPF = funcionario.CPF ?? row.CPF;
        const email = funcionario.email ?? row.email;
        const senha = funcionario.senha ?? row.senha;
        const cargo = funcionario.cargo ?? row.cargo;
        const data_contrato = funcionario.data_contrato
            ? funcionario.data_contrato.toISOString()
            : row.data_contrato;

        const res = await db.run(
            `UPDATE funcionarios
             SET nome = ?, CPF = ?, email = ?, senha = ?, cargo = ?, data_contrato = ?
             WHERE id = ?`,
            [nome, CPF, email, senha, cargo, data_contrato, id]
        );

        return res.changes;
    }

    static async delete(id: number) {
        const db = await dbPromisse;
        return db.run(`DELETE FROM funcionarios WHERE id = ?`, [id]);
    }
}