import LivroService from "../Service/LivroService";

export default class LivroController {
    static async criar(dados: { titulo: string; genero: string; preco: number; quantidade: number }, clienteId: number | null = null) {
        return LivroService.criar(dados as any, clienteId);
    }
    static async listar() { return LivroService.listar(); }
    static async buscar(id: number) { return LivroService.buscar(id); }
    static async atualizar(id: number, dados: Partial<any>, clienteId: number | null = null) { return LivroService.atualizar(id, dados, clienteId); }
    static async remover(id: number, clienteId: number | null = null) { return LivroService.remover(id, clienteId); }
}