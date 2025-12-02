import { Compra } from "../Modells/int_Compra";
import { f1, f2, f3, f4, f5 } from "./res_funcionarios";
import { u1, u2, u3, u4, u5 } from "./res_usuarios";
import TipoPagamento from "../Modells/enu_TipoPagamento";

export const v1 = {
    id_usuario: u1.id!,
    id_funcionario: f1.id!,
    metodo: TipoPagamento.Pix
};

export const v2 = {
    id_usuario: u2.id!,
    id_funcionario: f2.id!,
    metodo: TipoPagamento.Debito
};

export const v3 = {
    id_usuario: u3.id!,
    id_funcionario: f3.id!,
    metodo: TipoPagamento.Credito
};

export const v4 = {
    id_usuario: u4.id!,
    id_funcionario: f4.id!,
    metodo: TipoPagamento.Boleto
};

export const v5 = {
    id_usuario: u5.id!,
    id_funcionario: f5.id!,
    metodo: TipoPagamento.Pix
};