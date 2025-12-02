import Log from "./Modells/int_log";
import Usuario from "./Modells/int_Usuario";
import { gerarSenha } from "./GerarSenha";

const Usuarios: Usuario[] = []
const Logs: Log[] = []


function cadastrarUsuario (
    id: string,
    nome: string,
    email: string,
    papel: Papeis,
    permissoes: Permissoes[],
): Usuario {
    const novoUsuario: Usuario = {
    id,
    nome,
    email,
    senha: gerarSenha(),
    dataCriaUser: new Date(),
    papel,
    permissoes,
}

Usuarios.push(novoUsuario)
registrarAcao(id, "Cadastro realizado")
return novoUsuario
}

function registrarAcao(userId: string, 
acao: string): void {
    Logs.push({
        userId,
        acao,
        data: new Date()
    })
}

function podeExecutar(user:Usuario,
permissao: Permissoes): boolean {
    return user.permissoes.includes(permissao)
}

// usuarios
const admin = cadastrarUsuario("1", "Francine",
    "franbow@gmail.com",Papeis.ADM, [
    Permissoes.CAD,
    Permissoes.ATU,
    Permissoes.EXC]
)

const gerent = cadastrarUsuario("2", "Itwad",
    "itwardcinza@gmail.com", Papeis.ATE, [
    Permissoes.EXC,
    Permissoes.VEN]
)

const usuario = cadastrarUsuario("3", "Marcel",
    "marceldeern@gmail.com", Papeis.REP, [
    Permissoes.RES,
    Permissoes.COM]
)

// registros
registrarAcao(admin.id, "Excluiu um registro")
registrarAcao(gerent.id, "Atualiou um registro")
registrarAcao(usuario.id, "Visualizou um registro")

//permissoes
console.log(`Admin pode excluir? ${podeExecutar(admin, Permissoes.EXC)}`)
console.log(`Gerente pode excluir? ${podeExecutar(gerent, Permissoes.EXC)}`)
console.log(`Usuaio pode escrever? ${podeExecutar(usuario, Permissoes.RES)}`)

//logs
console.log("\n=== LOGS ===")
console.table(Logs)

//user
console.log("\n=== USUÁRIO ===")
console.table(Usuarios)