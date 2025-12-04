import { CompraLivro } from "../Modells/int_CompraLivro";
import { l1, l10, l2, l3, l4, l5, l6, l7, l8, l9 } from "./res_livros";

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

export const vl6 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l6.id!,
        quantidade: 1,
        preco_unitario: l6.preco
    }
]);

export const vl7 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l7.id!,
        quantidade: 1,
        preco_unitario: l7.preco
    }
]);

export const vl8 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l8.id!,
        quantidade: 1,
        preco_unitario: l8.preco
    }
]);

export const vl9 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l9.id!,
        quantidade: 1,
        preco_unitario: l9.preco
    }
]);

export const vl10 = (): Omit<CompraLivro, "id" | "id_compra">[] => ([
    {
        id_livro: l10.id!,
        quantidade: 1,
        preco_unitario: l10.preco
    }
]);