import TipoPagamento from "./enu_TipoPagamento";

export interface Compra {
    id?: number;
    id_cliente: number; 
    id_funcionario: number;
    metodo: TipoPagamento;
    valor_total: number;
    data: Date;
}