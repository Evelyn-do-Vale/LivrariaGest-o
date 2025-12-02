import AutorRepo from "../Repository/AutorRepo";
import LogRepo from "../Repository/LogRepo";
import Autor from "../Modells/int_autor";

export default class AutorService {
static async criar(autor: Autor, usuarioId: number | null = null) {
const res = await AutorRepo.create(autor);
await LogRepo.create(usuarioId, `Criou autor id=${autor.id} nome=${autor.nome}`);
return autor;
}

static async listar() {
return AutorRepo.findAll();
}

static async buscar(id: number) {
return AutorRepo.findById(id);
}

static async atualizar(id: number, dados: Partial<Autor>, usuarioId: number | null = null) {
const changes = await AutorRepo.update(id, dados);
if (changes) await LogRepo.create(usuarioId, `Atualizou autor id=${id}`);
return changes;
}

static async remover(id: number, usuarioId: number | null = null) {
const res = await AutorRepo.delete(id);
await LogRepo.create(usuarioId, `Excluiu autor id=${id}`);
return res;
}
}