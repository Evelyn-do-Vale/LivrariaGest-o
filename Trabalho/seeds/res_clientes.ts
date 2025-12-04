import Cliente from "../Modells/int_Cliente"
import { GerarSenha } from "../GerarSenha"
import ClienteService from "../Service/ClienteService"

export const c1: Cliente = await ClienteService.criar({
    nome: "Alice", 
    email: "Asmodeus@gmail.com", 
    senha: GerarSenha(),
    data_criacao: new Date ("2025-12-25T00:00:00Z")
})

export const c2: Cliente = await ClienteService.criar({
    nome: "Clara", 
    email: "Valac@gmail.com", 
    senha: GerarSenha(),
    data_criacao: new Date ("2025-11-11T00:00:00Z")
})

export const c3: Cliente = await ClienteService.criar({
    nome: "Sulivan", 
    email: "Sulivan@gmail.com", 
    senha: GerarSenha(),
    data_criacao: new Date ("2025-06-06T00:00:00Z")
})

export const c4: Cliente = await ClienteService.criar({
    nome: "Henri", 
    email: "Azazel@gmail.com", 
    senha: GerarSenha(),
    data_criacao: new Date ("2025-04-30T00:00:00Z")
})

export const c5: Cliente = await ClienteService.criar({
    nome: "Silvia", 
    email: "Sabnockc@gmail.com", 
    senha: GerarSenha(),
    data_criacao: new Date ("2025-01-15T00:00:00Z")
})
