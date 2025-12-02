import Cargo from "../Modells/enu_Cargo";
import FuncionarioService from "../Service/FuncionarioService";

export default class FuncionarioController {
static async criar(dados: {
    nome: string;
    CPF: string;
    email: string;
    senha?: string;
    cargo: Cargo;
}) {
    const funcionario = {
        nome: dados.nome,
        CPF: dados.CPF,
        email: dados.email,
        senha: dados.senha,
        cargo: dados.cargo,
        data_contrato: new Date()
    };

    return FuncionarioService.criar(funcionario as any);
}

static async listar() { return FuncionarioService.listar(); }
static async buscar(id: number) { return FuncionarioService.buscar(id); }
static async autenticar(email: string, senha: string) { return FuncionarioService.autenticar(email, senha); }
static async atualizar(id: number, dados: Partial<any>, funcionarioId: number | null = null) { return FuncionarioService.atualizar(id, dados, funcionarioId); }
static async remover(id: number, funcionarioId: number | null = null) { return FuncionarioService.remover(id, funcionarioId); }
}