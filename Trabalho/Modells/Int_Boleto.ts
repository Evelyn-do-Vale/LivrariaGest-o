import { StatusBoleto } from "./enu_Status_Boleto";

export interface Boleto {
    id?: number;
    numero: number;
    valor: number;
    data_emissao: Date;
    data_pagamento: Date | null;
    data_vencimento: Date;
    status: StatusBoleto;
    id_compra: number;
}