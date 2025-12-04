import { bancoPronto, dbPromisse } from "../bd";
import { Compra } from "../Modells/int_Compra";
import { CompraLivro } from "../Modells/int_CompraLivro";
import TipoPagamento from "../Modells/enu_TipoPagamento";
import LogService from "./LogService";
import BoletoService from "./BoletoService";
import { StatusBoleto } from "../Modells/enu_Status_Boleto";

export default class VendaService {

    static async criar(
        compra: Omit<Compra, "valor_total" | "data">,
        itens: { id_livro: number; quantidade: number }[],
        parcelas: number = 1
    ) {
        await bancoPronto;
        const db = await dbPromisse;

        // validar cliente
        const cliente = compra.id_cliente
            ? await db.get(`SELECT * FROM clientes WHERE id = ?`, [compra.id_cliente])
            : null;

        if (!cliente) throw new Error("Cliente não encontrado");
        if (!compra.id_funcionario)
            throw new Error("Compra precisa de um funcionário");

        // cálculo subtotal
        let subtotal = 0;
        const livrosDetalhados: CompraLivro[] = [];

        for (const item of itens) {
            const livro = await db.get(
                `SELECT * FROM livros WHERE id = ?`,
                [item.id_livro]
            );

            if (!livro) throw new Error(`Livro id=${item.id_livro} não encontrado`);
            if (livro.quantidade < item.quantidade)
                throw new Error(`Estoque insuficiente para o livro ${livro.titulo}`);

            subtotal += livro.preco * item.quantidade;

            livrosDetalhados.push({
                id_compra: 0,
                id_livro: item.id_livro,
                quantidade: item.quantidade,
                preco_unitario: livro.preco
            });
        }

        // regras pagamento
        let valorFinal = subtotal;

        switch (compra.metodo) {
            case TipoPagamento.Pix:
                valorFinal = Number((valorFinal * 0.95).toFixed(2))
                break;

            case TipoPagamento.Credito:
                if (parcelas < 1 || parcelas > 5)
                    throw new Error("Parcelas inválidas");
                break;

            case TipoPagamento.Boleto:
                // boleto é gerado DEPOIS da compra existir
                break;
        }

        // registrar venda
        const vendaCompleta: Compra = {
            ...compra,
            valor_total: valorFinal,
            data: new Date()
        };

        const vendaResult = await db.run(
            `INSERT INTO vendas (id_cliente, id_funcionario, metodo, valor_total, data)
             VALUES (?, ?, ?, ?, ?)`,
            [
                vendaCompleta.id_cliente,
                vendaCompleta.id_funcionario,
                vendaCompleta.metodo,
                vendaCompleta.valor_total,
                vendaCompleta.data.toLocaleDateString("pt-BR")
            ]
        );

        const id_compra = vendaResult.lastID;
        if (!id_compra && id_compra !== 0)
            throw new Error("Falha ao criar a compra");

        // registrar itens + estoque
        for (const item of livrosDetalhados) {
            item.id_compra = id_compra;

            await db.run(
                `INSERT INTO compra_livro (id_compra, id_livro, quantidade, preco_unitario)
                 VALUES (?, ?, ?, ?)`,
                [id_compra, item.id_livro, item.quantidade, item.preco_unitario]
            );

            const livroAtual = await db.get(
                `SELECT quantidade FROM livros WHERE id = ?`,
                [item.id_livro]
            );

            const novoEstoque = Number(livroAtual.quantidade) - item.quantidade;

            await db.run(
                `UPDATE livros SET quantidade = ? WHERE id = ?`,
                [novoEstoque, item.id_livro]
            );
        }

        // criar boleto APÓS a venda existir
        if (compra.metodo === TipoPagamento.Boleto) {
            const hoje = new Date();
            const venc = new Date();
            venc.setDate(hoje.getDate() + 7);

            await BoletoService.criar({
                id_compra: id_compra,
                data_emissao: hoje,
                data_vencimento: venc,
                data_pagamento: null,
                status: StatusBoleto.Pendente,
                valor: valorFinal
            }, id_compra);
        }

        await LogService.create(
            cliente.id,
            `Compra realizada id=${id_compra} total=${valorFinal.toFixed(2)}`
        );

        return id_compra;
    }

    static async listar() {
        const db = await dbPromisse;
        return db.all(`SELECT * FROM vendas ORDER BY id DESC`);
    }

    static async buscar(id: number) {
        const db = await dbPromisse;
        return db.get(`SELECT * FROM vendas WHERE id = ?`, [id]);
    }
}
