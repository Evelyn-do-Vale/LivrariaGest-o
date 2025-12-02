import VendaRepo from "../Repository/VendaRepo";
import CompraLivroRepo from "../Repository/CompraLivroRepo";
import LivroRepo from "../Repository/LivroRepo";
import UsuarioRepo from "../Repository/UsuarioRepo";
import LogRepo from "../Repository/LogRepo";
import BoletoRepo from "../Repository/BoletoRepo";
import { Compra } from "../Modells/int_Compra";
import { CompraLivro } from "../Modells/int_CompraLivro";
import TipoPagamento from "../Modells/enu_TipoPagamento";
import { Boleto } from "../Modells/Int_Boleto";
import { dbPromisse } from "../bd";

export default class VendaService {
    static async criar(
        compra: Omit<Compra, "valor_total" | "data">,
        itens: { id_livro: number; quantidade: number }[],
        parcelas: number = 1,
        boleto?: Boleto
    ) {
        const usuario = compra.id_usuario
            ? await UsuarioRepo.findById(compra.id_usuario)
            : null;

        if (!usuario) throw new Error("Usuário não encontrado");

        if (!compra.id_funcionario)
            throw new Error("Compra precisa de um funcionário");

        let subtotal = 0;
        const livrosDetalhados: CompraLivro[] = [];

        for (const item of itens) {
            const livro = await LivroRepo.findById(item.id_livro);
            if (!livro) throw new Error(`Livro id=${item.id_livro} não encontrado`);

            if (livro.quantidade < item.quantidade)
                throw new Error(`Estoque insuficiente para o livro ${livro.titulo}`);

            subtotal += livro.preco * item.quantidade;

            livrosDetalhados.push({
                id_compra: 0,
                id_livro: item.id_livro,
                quantidade: item.quantidade,
                preco_unitario: livro.preco,
            });
        }

        let valorFinal = subtotal;

        switch (compra.metodo) {
            case TipoPagamento.Pix:
                valorFinal *= 0.95;
                break;

            case TipoPagamento.Debito:
                break;

            case TipoPagamento.Credito:
                if (parcelas < 1 || parcelas > 5)
                    throw new Error("Parcelas inválidas");
                break;

            case TipoPagamento.Boleto:
                if (!boleto)
                    throw new Error("Boleto obrigatório para este pagamento");

                if (boleto.data_pagamento && boleto.data_pagamento > boleto.data_vencimento) {
                    const diasAtraso = Math.floor(
                        (boleto.data_pagamento.getTime() - boleto.data_vencimento.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    valorFinal += subtotal * 0.02 + subtotal * 0.001 * diasAtraso;
                }
                break;
        }

        const compraCriada: Compra = {
            ...compra,
            valor_total: valorFinal,
            data: new Date()
        };

        const compraId = await VendaRepo.create(compraCriada);

        if (!compraId && compraId !== 0) {
            throw new Error("Falha ao criar a compra (id inválido).");
        }
        const compraIdNum = Number(compraId);

        for (const item of livrosDetalhados) {
            item.id_compra = compraIdNum;
            await CompraLivroRepo.create(item);

            await LivroRepo.diminuirEstoque(item.id_livro, item.quantidade);
        }

        if (compra.metodo === TipoPagamento.Boleto && boleto) {
            (boleto as any).id_venda = compraIdNum;
            await BoletoRepo.create(boleto);
        }

        const usuarioIdParaLog = usuario.id ?? null;
        await LogRepo.create(
            usuarioIdParaLog,
            `Compra realizada id=${compraIdNum} total=${valorFinal.toFixed(2)}`
        );

        return compraIdNum;
    }

    static listar() {
        return VendaRepo.findAll();
    }

    static buscar(id: number) {
        return VendaRepo.findById(id);
    }
}