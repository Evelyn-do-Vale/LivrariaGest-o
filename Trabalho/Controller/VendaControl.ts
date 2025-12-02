import VendaService from "../Service/VendaService";
import { Compra } from "../Modells/int_Compra";
import { Boleto } from "../Modells/Int_Boleto";

export default class VendaController {
    
    static async criar(
        compra: Omit<Compra, "valor_total" | "data">,
        itens: { id_livro: number; quantidade: number }[],
        parcelas: number = 1,
        boleto?: Boleto
    ) {
        return VendaService.criar(compra, itens, parcelas, boleto);
    }

    static async listar() { 
        return VendaService.listar(); 
    }

    static async buscar(id: number) { 
        return VendaService.buscar(id); 
    }
}