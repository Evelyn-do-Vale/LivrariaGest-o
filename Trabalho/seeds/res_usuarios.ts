import Usuario from "../Modells/int_usuario"
import { GerarSenha } from "../GerarSenha"

export const u1: Usuario = {nome: "Alice", email: "Asmodeus@gmail.com", senha: GerarSenha() ,data_criacao: new Date ("2025-12-25T00:00:00Z")}
export const u2: Usuario = {nome: "Clara", email: "Valac@gmail.com", senha: GerarSenha() ,data_criacao: new Date ("2025-11-11T00:00:00Z")}
export const u3: Usuario = {nome: "Sulivan", email: "Sulivan@gmail.com", senha: GerarSenha() ,data_criacao: new Date ("2025-06-06T00:00:00Z")}
export const u4: Usuario = {nome: "Henri", email: "Azazel@gmail.com", senha: GerarSenha() ,data_criacao: new Date ("2025-04-30T00:00:00Z")}
export const u5: Usuario = {nome: "Silvia", email: "Sabnockc@gmail.com", senha: GerarSenha() ,data_criacao: new Date ("2025-01-15T00:00:00Z")}
