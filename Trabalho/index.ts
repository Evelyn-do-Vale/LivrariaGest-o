
import { dbPromisse, bancoPronto } from "./bd";
import AutorController from "./Controller/AutorControl";
import FuncionarioController from "./Controller/FuncionarioControl";
import LivroController from "./Controller/LivroControl";
import ClienteController from "./Controller/ClienteControl";
import VendaController from "./Controller/VendaControl";
import { a1, a2, a3, a4, a5 } from "./seeds/res_autores";
import { f1, f2, f3, f4, f5 } from "./seeds/res_funcionarios";
import { l1, l10, l2, l3, l4, l5, l6, l7, l8, l9 } from "./seeds/res_livros";
import { c1, c2, c3, c4, c5 } from "./seeds/res_clientes";
import { vl1, vl10, vl2, vl3, vl4, vl5, vl6, vl7, vl8, vl9 } from "./seeds/res_vendaLivro";
import { v1, v2, v3, v4, v5, } from "./seeds/res_vendas";
import AutorLivroService from "./Service/AutorLivroService";

async function main() {
    console.clear();
    console.log("Iniciando banco de dados...");
    await bancoPronto;
    const db = await dbPromisse;
    await db.exec("PRAGMA foreign_keys = ON;")

    console.log("Populando clientes...");
    await ClienteController.criar(c1);
    await ClienteController.criar(c2);
    await ClienteController.criar(c3);
    await ClienteController.criar(c4);
    await ClienteController.criar(c5);

    console.log("=== CLIENTES ===");
    console.table(await ClienteController.listar());

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
    await FuncionarioController.criar(f1);
    await FuncionarioController.criar(f2);
    await FuncionarioController.criar(f3);
    await FuncionarioController.criar(f4);
    await FuncionarioController.criar(f5);

    console.log("=== FUNCIONÁRIOS ===");
    console.table(await FuncionarioController.listar());

    console.log("Populando AutorLivro...");
    await AutorLivroService.vincular(a1.id!, l1.id!); // Dom Quixote
    await AutorLivroService.vincular(a1.id!, l6.id!); // El coloquio de los perros
    await AutorLivroService.vincular(a2.id!, l2.id!); // Senhor dos Anéis
    await AutorLivroService.vincular(a2.id!, l7.id!); // O Hobbit
    await AutorLivroService.vincular(a3.id!, l3.id!); // 1984
    await AutorLivroService.vincular(a3.id!, l8.id!); // Revolução dos bichos
    await AutorLivroService.vincular(a4.id!, l4.id!); // Moby Dick
    await AutorLivroService.vincular(a4.id!, l9.id!); // Billy Budd
    await AutorLivroService.vincular(a5.id!, l5.id!); // Hamlet
    await AutorLivroService.vincular(a5.id!, l10.id!);// Romeu e Julieta

    console.log("Criando vendas...");
    await VendaController.criar(
    { ...v1 },
    [...vl2(), ...vl3()]
    );

    await VendaController.criar(
    { ...v2 },
    [...vl1(), ...vl4()
    ]);

    await VendaController.criar(
    { ...v3 },
    [...vl6(), ...vl5()
    ]);

    await VendaController.criar(
    { ...v4 },
    [...vl2(), ...vl8(), ...vl7()
    ]);

    await VendaController.criar(
    { ...v5 },
    [...vl10(), ...vl9()
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