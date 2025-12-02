import LivroService from "../Service/LivroService";


export default class LivroController {
    static async criar(dados: { titulo: string; genero: string; preco: number; quantidade: number }, usuarioId: number | null = null) {
        return LivroService.criar(dados as any, usuarioId);
    }
    static async listar() { return LivroService.listar(); }
    static async buscar(id: number) { return LivroService.buscar(id); }
    static async atualizar(id: number, dados: Partial<any>, usuarioId: number | null = null) { return LivroService.atualizar(id, dados, usuarioId); }
    static async remover(id: number, usuarioId: number | null = null) { return LivroService.remover(id, usuarioId); }
}