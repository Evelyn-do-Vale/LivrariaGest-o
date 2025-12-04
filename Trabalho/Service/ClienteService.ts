import { bancoPronto, dbPromisse } from "../bd";
import Cliente from "../Modells/int_Cliente";
import LogService from "./LogService";

export default class ClienteService {

    static async criar(cliente: Cliente) {
        await bancoPronto;
        const db = await dbPromisse;

            const jaExiste = await db.get(
                `SELECT id FROM clientes WHERE email = ?`,
                [cliente.email]
            );

            if (jaExiste) {
                cliente.id = jaExiste.id;
                return cliente;
            }

        cliente.data_criacao = cliente.data_criacao ?? new Date();

        const res = await db.run(
            `INSERT INTO clientes (nome, email, senha, data_criacao)
             VALUES (?, ?, ?, ?)`,
            [
                cliente.nome,
                cliente.email,
                cliente.senha ?? null,
                cliente.data_criacao.toLocaleDateString("pt-BR")
            ]
        );

        cliente.id = res.lastID;

        await LogService.create(cliente.id ?? null, `Criou cliente id=${cliente.id} email=${cliente.email}`);

        return cliente;
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all<Cliente[]>(`SELECT * FROM clientes`);
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get<Cliente>(`SELECT * FROM clientes WHERE id = ?`, [id]);
    }

    static async autenticar(email: string, senha: string) {
        const db = await dbPromisse;

        const u = await db.get<Cliente>(
            `SELECT * FROM clientes WHERE email = ?`,
            [email]
        );

        if (!u) return null;

        if (u.senha === senha) {
            await LogService.create(u.id ?? null, `Login bem-sucedido`);
            return u;
        }

        await LogService.create(u.id ?? null, `Login falhou`);
        return null;
    }

    static async atualizar(id: number, dados: Partial<Cliente>, id_cliente: number | null = null) {
        const db = await dbPromisse;

        const row = await db.get<Cliente>(`SELECT * FROM clientes WHERE id = ?`, [id]);
        if (!row) return null;

        const nome = dados.nome ?? row.nome;
        const email = dados.email ?? row.email;
        const senha = dados.senha ?? row.senha;

        const data_criacao = dados.data_criacao
            ? dados.data_criacao.toISOString()
            : row.data_criacao;

        const res = await db.run(
            `UPDATE clientes
             SET nome = ?, email = ?, senha = ?, data_criacao = ?
             WHERE id = ?`,
            [nome, email, senha, data_criacao, id]
        );

        if (res.changes) {
            await LogService.create(id_cliente, `Atualizou cliente id=${id}`);
        }

        return res.changes;
    }

    static async remover(id: number, id_cliente: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(
            `DELETE FROM clientes WHERE id = ?`,
            [id]
        );

        await LogService.create(id_cliente, `Excluiu cliente id=${id}`);

        return res;
    }
}
