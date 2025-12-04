import { Compra } from "../Modells/int_Compra";
import { f1, f2, f3, f4, f5 } from "./res_funcionarios";
import { c1, c2, c3, c4, c5 } from "./res_clientes";
import TipoPagamento from "../Modells/enu_TipoPagamento";

export const v1 = {
    id_cliente: c1.id!,
    id_funcionario: f1.id!,
    metodo: TipoPagamento.Pix
};

export const v2 = {
    id_cliente: c2.id!,
    id_funcionario: f2.id!,
    metodo: TipoPagamento.Debito
};

export const v3 = {
    id_cliente: c3.id!,
    id_funcionario: f3.id!,
    metodo: TipoPagamento.Credito
};

export const v4 = {
    id_cliente: c4.id!,
    id_funcionario: f4.id!,
    metodo: TipoPagamento.Boleto
};

export const v5 = {
    id_cliente: c5.id!,
    id_funcionario: f5.id!,
    metodo: TipoPagamento.Pix
};