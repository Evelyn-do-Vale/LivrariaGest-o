
import { dbPromisse, initDB } from "./bd";
import AutorController from "./Controller/AutorControl";
import FuncionarioController from "./Controller/FuncionarioControl";
import LivroController from "./Controller/LivroControl";
import UsuarioController from "./Controller/UsuarioControl";
import VendaController from "./Controller/VendaControl";
import TipoPagamento from "./Modells/enu_TipoPagamento";
import { a1, a2, a3, a4, a5 } from "./seeds/res_autores";
import { f1, f2, f3, f4, f5 } from "./seeds/res_funcionarios";
import { l1, l10, l2, l3, l4, l5, l6, l7, l8, l9 } from "./seeds/res_livros";
import { u1, u2, u3, u4, u5 } from "./seeds/res_usuarios";
import { vl1, vl2, vl3, vl4, vl5 } from "./seeds/res_vendaLivro";
import { v1, v2, v3, v4, v5, } from "./seeds/res_vendas";

async function main() {
    console.clear();
    console.log("Iniciando banco de dados...");
    await initDB();
    const db = await dbPromisse;
    await db.exec("PRAGMA foreign_keys = ON;")

    console.log("Populando usuários...");
    const user1 = await UsuarioController.criar(u1);
    const user2 = await UsuarioController.criar(u2);
    const user3 = await UsuarioController.criar(u3);
    const user4 = await UsuarioController.criar(u4);
    const user5 = await UsuarioController.criar(u5);

    console.log("=== USUÁRIOS ===");
    console.table(await UsuarioController.listar());

    console.log("Populando autores...");
    await AutorController.criar(a1);
    await AutorController.criar(a2);
    await AutorController.criar(a3);
    await AutorController.criar(a4);
    await AutorController.criar(a5);

    console.log("=== AUTORES ===");
    console.table(await AutorController.listar());

    console.log("Populando livros...");
    await LivroController.criar(l1);
    await LivroController.criar(l2);
    await LivroController.criar(l3);
    await LivroController.criar(l4);
    await LivroController.criar(l5);
    await LivroController.criar(l6);
    await LivroController.criar(l7);
    await LivroController.criar(l8);
    await LivroController.criar(l9);
    await LivroController.criar(l10);

    console.log("=== LIVROS ===");
    console.table(await LivroController.listar());

    console.log("Populando funcionários...");
    const fun1 = await FuncionarioController.criar(f1);
    const fun2 = await FuncionarioController.criar(f2);
    const fun3 = await FuncionarioController.criar(f3);
    const fun4 = await FuncionarioController.criar(f4);
    const fun5 = await FuncionarioController.criar(f5);

    console.log("=== FUNCIONÁRIOS ===");
    console.table(await FuncionarioController.listar());

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v1 },
    [...vl2(), ...vl3()]
    );

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v2 },
    [...vl1(), ...vl4()
    ]);

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v3 },
    [...vl1(), ...vl5()
    ]);

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v4 },
    [...vl2(), ...vl4(), ...vl1()
    ]);

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v5 },
    [...vl5(), ...vl3()
    ]);

    console.log("=== VENDAS ===");
    console.table(await VendaController.listar());

    console.log("Sistema iniciado e populado com sucesso!");
}

main();

/*

async function AlterUsuario(){
    const db = await dbPromisse;
    await db.exec(`
    ALTER TABLE usuarios
    RENAME COLUMN nome TO nome_usuario
    `)}
    
    await AlterUsuario()
    

async function DropUsuario(){
    const db = await dbPromisse;
    await db.exec(`
        DROP TABLE IF EXISTS usuarios
        `)}
        
        await DropUsuario()
        




async function AlterFuncionarios(){
    const db = await dbPromisse;
    await db.exec(`
        ALTER TABLE funcionarios
        RENAME COLUMN nome TO nome_funcionario
        `)}

await AlterFuncionarios()

async function DropFuncionarios(){
    const db = await dbPromisse;
    await db.exec(`
        DROP TABLE IF EXISTS funcionarios
        `)}

await DropFuncionarios()




async function AlterLivros(){
    const db = await dbPromisse;
    await db.exec(`
        ALTER TABLE livros
        RENAME COLUMN titulo TO titulo_livro
        `)}
        
        await AlterLivros()

async function DropLivros(){
    const db = await dbPromisse;
    await db.exec(`
        DROP TABLE IF EXISTS livros
        `)}

await DropLivros()




async function AlterVendas(){
    const db = await dbPromisse;
    await db.exec(`
        ALTER TABLE vendas
        RENAME COLUMN valor TO preco
        `)}

await AlterVendas()

async function DropVendas(){
    const db = await dbPromisse;
    await db.exec(`
        DROP TABLE IF EXISTS vendas
        `)}

await DropVendas()

*/