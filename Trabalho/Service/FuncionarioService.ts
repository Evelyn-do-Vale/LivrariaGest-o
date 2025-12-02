import FuncionarioRepo from "../Repository/FuncionarioRepo";
import LogRepo from "../Repository/LogRepo";
import Funcionario from "../Modells/int_funcionario";

export default class FuncionarioService {

    static async criar(funcionario: Funcionario) {

        funcionario.data_contrato = funcionario.data_contrato ?? new Date();

        const criado = await FuncionarioRepo.create(funcionario);
    }

    static async listar() {
        return FuncionarioRepo.findAll();
    }

    static async buscar(id: number) {
        return FuncionarioRepo.findById(id);
    }

    static async autenticar(email: string, senha: string) {
        const u = await FuncionarioRepo.findByEmail(email);
        if (!u) return null;

        if (u.senha === senha) {
            await LogRepo.create(u.id!, `Login bem-sucedido`);
            return u;
        }

        await LogRepo.create(u.id!, `Login falhou`);
        return null;
    }

    static async atualizar(id: number, dados: Partial<Funcionario>, funcionarioId: number | null = null) {
        const changes = await FuncionarioRepo.update(id, dados);

        if (changes) {
            await LogRepo.create(
                funcionarioId,
                `Atualizou funcionário id=${id}`
            );
        }

        return changes;
    }

    static async remover(id: number, funcionarioId: number | null = null) {
        const res = await FuncionarioRepo.delete(id);

        await LogRepo.create(
            funcionarioId,
            `Excluiu funcionário id=${id}`
        );

        return res;
    }
}