import LivroRepo from "../Repository/LivroRepo";
import LogRepo from "../Repository/LogRepo";
import Livros from "../Modells/int_livro";

export default class LivroService {
    static async criar(livro: Livros, usuarioId: number | null = null) {
        const res = await LivroRepo.create(livro);
        await LogRepo.create(usuarioId, `Criou livro id=${livro.id} titulo=${livro.titulo}`);
        return livro;
    }

    static async listar() {
        return LivroRepo.findAll();
    }

    static async buscar(id: number) {
        return LivroRepo.findById(id);
    }

    static async atualizar(id: number, dados: Partial<Livros>, usuarioId: number | null = null) {
        const changes = await LivroRepo.update(id, dados);
        if (changes) await LogRepo.create(usuarioId, `Atualizou livro id=${id}`);
        return changes;
    }

    static async remover(id: number, usuarioId: number | null = null) {
        const res = await LivroRepo.delete(id);
        await LogRepo.create(usuarioId, `Excluiu livro id=${id}`);
        return res;
    }
}