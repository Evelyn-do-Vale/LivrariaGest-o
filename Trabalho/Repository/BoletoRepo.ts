import { dbPromisse } from "../bd";
import { Boleto } from "../Modells/Int_Boleto";

export default class BoletoRepo {

    static async create(boleto: Boleto) {
        const db = await dbPromisse;

        const res = await db.run(
            `INSERT INTO boletos 
                (id_venda, data_emissao, data_vencimento, data_pagamento, valor)
             VALUES (?, ?, ?, ?, ?)`,
            [
                boleto.id_compra,
                boleto.data_emissao.toLocaleDateString("pt-BR"),
                boleto.data_vencimento.toLocaleDateString("pt-BR"),
                boleto.data_pagamento ? boleto.data_pagamento.toLocaleDateString("pt-BR") : null,
                boleto.valor
            ]
        );

        boleto.id = res.lastID;
        return res.lastID;
    }

    static async findByVenda(id_venda: number) {
        const db = await dbPromisse;
        return db.get<Boleto>(
            `SELECT * FROM boletos WHERE id_venda = ?`,
            [id_venda]
        );
    }

    static async findById(id: number) {
        const db = await dbPromisse;
        return db.get<Boleto>(
            `SELECT * FROM boletos WHERE id = ?`,
            [id]
        );
    }

    static async update(id: number, dados: Partial<Boleto>) {
        const db = await dbPromisse;

        const atual = await db.get<Boleto>(`SELECT * FROM boletos WHERE id = ?`, [id]);
        if (!atual) return null;

        const novo = {
            data_emissao: dados.data_emissao?.toLocaleDateString("pt-BR") ?? atual.data_emissao,
            data_vencimento: dados.data_vencimento?.toLocaleDateString("pt-BR") ?? atual.data_vencimento,
            data_pagamento: dados.data_pagamento
                ? dados.data_pagamento.toLocaleDateString("pt-BR")
                : atual.data_pagamento,
            valor: dados.valor ?? atual.valor
        };

        const res = await db.run(
            `UPDATE boletos SET 
                data_emissao = ?, 
                data_vencimento = ?, 
                data_pagamento = ?, 
                valor = ?
             WHERE id = ?`,
            [
                novo.data_emissao,
                novo.data_vencimento,
                novo.data_pagamento,
                novo.valor,
                id
            ]
        );

        return res.changes;
    }

    static async delete(id: number) {
        const db = await dbPromisse;
        return db.run(`DELETE FROM boletos WHERE id = ?`, [id]);
    }
}