import AutorService from "../Service/AutorService";

export default class AutorController {
    static async criar(dados: { nome: string }, clienteId: number | null = null) {
        return AutorService.criar({ nome: dados.nome }, clienteId);
    }

    static async listar() { return AutorService.listar(); }
    static async buscar(id: number) { return AutorService.buscar(id); }
    static async atualizar(id: number, dados: { nome?: string }, clienteId: number | null = null) { return AutorService.atualizar(id, dados, clienteId); }
    static async remover(id: number, clienteId: number | null = null) { return AutorService.remover(id, clienteId); }
}