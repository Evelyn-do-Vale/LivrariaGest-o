import { CompraLivro } from "../Modells/int_CompraLivro";
import { l1, l2, l3, l4, l5 } from "./res_livros";

export const vl1 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l1.id!,
        quantidade: 1,
        preco_unitario: l1.preco
    }
]);

export const vl2 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l2.id!,
        quantidade: 1,
        preco_unitario: l2.preco
    }
]);

export const vl3 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l3.id!,
        quantidade: 1,
        preco_unitario: l3.preco
    }
]);

export const vl4 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l4.id!,
        quantidade: 1,
        preco_unitario: l4.preco
    }
]);

export const vl5 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l5.id!,
        quantidade: 1,
        preco_unitario: l5.preco
    }
]);