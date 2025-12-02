import UsuarioService from "../Service/UsuarioService";

export default class UsuarioController {
static async criar(dados: { nome: string; email: string; senha?: string }) {
    const usuario = {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    data_criacao: new Date()
    };
    return UsuarioService.criar(usuario as any);
}

static async listar() { return UsuarioService.listar(); }
static async buscar(id: number) { return UsuarioService.buscar(id); }
static async autenticar(email: string, senha: string) { return UsuarioService.autenticar(email, senha); }
static async atualizar(id: number, dados: Partial<any>, usuarioId: number | null = null) { return UsuarioService.atualizar(id, dados, usuarioId); }
static async remover(id: number, usuarioId: number | null = null) { return UsuarioService.remover(id, usuarioId); }
}