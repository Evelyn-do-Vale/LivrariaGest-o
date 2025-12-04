import ClienteService from "../Service/ClienteService";

export default class ClienteController {
static async criar(dados: { nome: string; email: string; senha?: string }) {
    const cliente = {
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    data_criacao: new Date()
    };
    return ClienteService.criar(cliente as any);
}

static async listar() { return ClienteService.listar(); }
static async buscar(id: number) { return ClienteService.buscar(id); }
static async autenticar(email: string, senha: string) { return ClienteService.autenticar(email, senha); }
static async atualizar(id: number, dados: Partial<any>, clienteId: number | null = null) { return ClienteService.atualizar(id, dados, clienteId); }
static async remover(id: number, clienteId: number | null = null) { return ClienteService.remover(id, clienteId); }
}