import { dbPromisse } from "../db";

export class PedidoRepo {

    async criarPedido(usuarioId: number, data: string) {
        await dbPromisse.run(
            `INSERT INTO pedidos (usuario_id, data_criacao)
             VALUES (?, ?)`,
            [usuarioId, data]
        );
    }

    async listarPedidos() {
        return dbPromisse.all(`SELECT * FROM pedidos`);
    }

    async buscarPorId(id: number) {
        return dbPromisse.get(`SELECT * FROM pedidos WHERE id = ?`, [id]);
    }

    async atualizarPedido(id: number, novaData: string) {
        await dbPromisse.run(
            `UPDATE pedidos SET data_criacao = ?
             WHERE id = ?`,
            [novaData, id]
        );
    }

    async deletarPedido(id: number) {
        await dbPromisse.run(
            `DELETE FROM pedidos WHERE id = ?`,
            [id]
        );
    }
}