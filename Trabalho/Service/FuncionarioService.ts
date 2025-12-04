import { bancoPronto, dbPromisse } from "../bd";
import Funcionario from "../Modells/int_funcionario";
import LogService from "./LogService";

export default class FuncionarioService {

    static async criar(funcionario: Funcionario, id_funcionario: number | null = null) {
        await bancoPronto;
        const db = await dbPromisse;

            const jaExiste = await db.get(
                `SELECT id FROM funcionarios WHERE CPF = ?`,
                [funcionario.CPF]
            );

            if (jaExiste) {
                funcionario.id = jaExiste.id;
                return funcionario;
            }

        funcionario.data_contrato = funcionario.data_contrato ?? new Date();

        const res = await db.run(
            `INSERT INTO funcionarios 
                (nome, CPF, email, senha, cargo, data_contrato)
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

        await LogService.create(id_funcionario, `Criou funcionário id=${funcionario.id}`);

        return funcionario;
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all<Funcionario[]>(`SELECT * FROM funcionarios`);
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get<Funcionario>(`SELECT * FROM funcionarios WHERE id = ?`, [id]);
    }

    static async buscarPorEmail(email: string) {
        const db = await dbPromisse;
        return db.get<Funcionario>(`SELECT * FROM funcionarios WHERE email = ?`, [email]);
    }

    static async autenticar(email: string, senha: string) {
        const f = await this.buscarPorEmail(email);
        if (!f) return null;

        if (f.senha === senha) {
            await LogService.create(f.id!, `Login bem-sucedido`);
            return f;
        }

        await LogService.create(f.id!, `Login falhou`);
        return null;
    }

    static async atualizar(
        id: number,
        dados: Partial<Funcionario>,
        id_funcionario: number | null = null
    ) {
        const db = await dbPromisse;

        const atual = await db.get<Funcionario>(`SELECT * FROM funcionarios WHERE id = ?`, [id]);
        if (!atual) return null;

        const novo = {
            nome: dados.nome ?? atual.nome,
            CPF: dados.CPF ?? atual.CPF,
            email: dados.email ?? atual.email,
            senha: dados.senha ?? atual.senha,
            cargo: dados.cargo ?? atual.cargo,
            data_contrato: dados.data_contrato
                ? dados.data_contrato.toISOString()
                : atual.data_contrato
        };

        const res = await db.run(
            `UPDATE funcionarios
             SET nome = ?, CPF = ?, email = ?, senha = ?, cargo = ?, data_contrato = ?
             WHERE id = ?`,
            [
                novo.nome,
                novo.CPF,
                novo.email,
                novo.senha,
                novo.cargo,
                novo.data_contrato,
                id
            ]
        );

        if (res.changes)
            await LogService.create(id_funcionario, `Atualizou funcionário id=${id}`);

        return res.changes;
    }

    static async remover(id: number, id_funcionario: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(
            `DELETE FROM funcionarios WHERE id = ?`,
            [id]
        );

        await LogService.create(id_funcionario, `Removeu funcionário id=${id}`);

        return res;
    }
}
