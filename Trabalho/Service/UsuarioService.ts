import UsuarioRepo from "../Repository/UsuarioRepo";
import LogRepo from "../Repository/LogRepo";
import Usuario from "../Modells/int_usuario";

export default class UsuarioService {
    static async criar(usuario: Usuario) {

        usuario.data_criacao = usuario.data_criacao ?? new Date();
        const res = await UsuarioRepo.create(usuario);
        await LogRepo.create(usuario.id ?? null, `Criou usuário id=${usuario.id} email=${usuario.email}`);
        usuario.id = res.lastID;
        return usuario;
    }

    static async listar() {
        return UsuarioRepo.findAll();
    }

    static async buscar(id: number) {
        return UsuarioRepo.findById(id);
    }

    static async autenticar(email: string, senha: string) {
        const u = await UsuarioRepo.findByEmail(email);
        if (!u) return null;

        if (u.senha === senha) {
            await LogRepo.create(u.id ?? null, `Login bem-sucedido`);
            return u;
        }
        await LogRepo.create(u.id ?? null, `Login falhou`);
        return null;
    }

    static async atualizar(id: number, dados: Partial<Usuario>, usuarioId: number | null = null) {
        const changes = await UsuarioRepo.update(id, dados);
        if (changes) await LogRepo.create(usuarioId, `Atualizou usuário id=${id}`);
        return changes;
    }

    static async remover(id: number, usuarioId: number | null = null) {
        const res = await UsuarioRepo.delete(id);
        await LogRepo.create(usuarioId, `Excluiu usuário id=${id}`);
        return res;
    }
}