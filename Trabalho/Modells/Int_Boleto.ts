import { StatusBoleto } from "./enu_Status_Boleto";

export interface Boleto {
    id?: number;
    id_compra: number;
    data_emissao: Date;
    data_vencimento: Date;
    data_pagamento: Date | null;
    status: StatusBoleto;
    valor: number;
}