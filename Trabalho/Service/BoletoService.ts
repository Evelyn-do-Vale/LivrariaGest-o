import { bancoPronto, dbPromisse } from "../bd";
import { Boleto } from "../Modells/Int_Boleto";
import LogService from "./LogService";

export default class BoletoService {

    static async criar(boleto: Boleto, id_compra: number | null = null) {
        await bancoPronto;
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO boletos 
            (id_compra, data_emissao, data_vencimento, data_pagamento, status, valor)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
            boleto.id_compra,
            boleto.data_emissao ? boleto.data_emissao.toLocaleDateString("pt-BR") : null,
            boleto.data_vencimento ? boleto.data_vencimento.toLocaleDateString("pt-BR") : null,
            boleto.data_pagamento ? boleto.data_pagamento.toLocaleDateString("pt-BR") : null,
            boleto.status,
            boleto.valor
        ]
    );

        boleto.id = res.lastID;

        await LogService.create(id_compra, `Criou boleto id=${boleto.id} para venda=${boleto.id_compra}`);

        return boleto;
    }

    static async buscarPorVenda(id_compra: number) {
        const db = await dbPromisse;
        return db.get<Boleto>(
            `SELECT * FROM boletos WHERE id_compra = ?`,
            [id_compra]
        );
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get<Boleto>(
            `SELECT * FROM boletos WHERE id = ?`,
            [id]
        );
    }

    static async atualizar(id: number, dados: Partial<Boleto>, id_compra: number | null = null) {
        const db = await dbPromisse;

        const atual = await db.get<Boleto>(`SELECT * FROM boletos WHERE id = ?`, [id]);
        if (!atual) return null;

        const novo = {
            data_emissao: dados.data_emissao ?.toLocaleDateString("pt-BR") ?? atual.data_emissao,
            data_vencimento: dados.data_vencimento ?.toLocaleDateString("pt-BR") ?? atual.data_vencimento,
            data_pagamento: dados.data_pagamento ? dados.data_pagamento.toLocaleDateString("pt-BR") : atual.data_pagamento,
            status: dados.status ?? atual.status,
            valor: dados.valor ?? atual.valor
        };

        const res = await db.run(
            `UPDATE boletos SET 
                data_emissao = ?, 
                data_vencimento = ?, 
                data_pagamento = ?, 
                status = ?, 
                valor = ?
             WHERE id = ?`,
            [
                novo.data_emissao,
                novo.data_vencimento,
                novo.data_pagamento,
                novo.status,
                novo.valor,
                id
            ]
        );

        if (res.changes)
            await LogService.create(id_compra, `Atualizou boleto id=${id}`);

        return res.changes;
    }

    static async remover(id: number, id_compra: number | null = null) {
        const db = await dbPromisse;

        const res = await db.run(`DELETE FROM boletos WHERE id = ?`, [id]);

        await LogService.create(id_compra, `Removeu boleto id=${id}`);

        return res;
    }
}
