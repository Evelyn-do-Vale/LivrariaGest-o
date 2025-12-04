import Autor from "../Modells/int_autor"
import AutorService from "../Service/AutorService";

export const a1 = await AutorService.criar({ nome: "Miguel de Cervantes" });
export const a2 = await AutorService.criar({ nome: "J.R.R. Tolkien" });
export const a3 = await AutorService.criar({ nome: "George Orwell" });
export const a4 = await AutorService.criar({ nome: "Herman Melville" });
export const a5 = await AutorService.criar({ nome: "William Shakespeare" });