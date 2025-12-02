import AutorService from "../Service/AutorService";

export default class AutorController {
    static async criar(dados: { nome: string }, usuarioId: number | null = null) {
        return AutorService.criar({ nome: dados.nome }, usuarioId);
    }

    static async listar() { return AutorService.listar(); }
    static async buscar(id: number) { return AutorService.buscar(id); }
    static async atualizar(id: number, dados: { nome?: string }, usuarioId: number | null = null) { return AutorService.atualizar(id, dados, usuarioId); }
    static async remover(id: number, usuarioId: number | null = null) { return AutorService.remover(id, usuarioId); }
}