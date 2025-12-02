import TipoPagamento from "./enu_TipoPagamento";

export interface Compra {
    id?: number;
    id_usuario: number; 
    id_funcionario: number;
    metodo: TipoPagamento;
    valor_total: number;
    data: Date;
}