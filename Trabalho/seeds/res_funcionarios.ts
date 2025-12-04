import Cargo from "../Modells/enu_Cargo";
import Funcionario from "../Modells/int_funcionario";
import FuncionarioService from "../Service/FuncionarioService";

export const f1: Funcionario = await FuncionarioService.criar({
    nome: "Mephisto Daemonium", 
    CPF: "697.384.896-24", 
    email: "Mephisto@gmail.com", 
    senha: "5456", 
    cargo: Cargo.ADM,
    data_contrato: new Date ("2024-11-23T00:00:00")
})

export const f2: Funcionario = await FuncionarioService.criar({
    nome: "Dana Terrace", 
    CPF: "159.753.684-28", 
    email: "Terrece@gmail.com", 
    senha: "8946", cargo: Cargo.ATE,
    data_contrato: new Date ("2024-10-20T00:00:00")
})

export const f3: Funcionario = await FuncionarioService.criar({
    nome: "Alex Hirsch", 
    CPF: "624.917.391-73", 
    email: "Hirsch@gmail.com", 
    senha: "2135", cargo: Cargo.GER,
    data_contrato: new Date ("2025-07-15T00:00:00")
})

export const f4: Funcionario = await FuncionarioService.criar({
    nome: "Noelle Stevenson", 
    CPF: "317.671.349-55", 
    email: "Stevenson@gmail.com", 
    senha: "9614", cargo: Cargo.ATE,
    data_contrato: new Date ("2025-04-02T00:00:00")
})

export const f5: Funcionario = await FuncionarioService.criar({
    nome: "Rebecca Sugar", 
    CPF: "756.489.348-62", 
    email: "Sugar@gmail.com", 
    senha: "4345", cargo: Cargo.ADM,
    data_contrato: new Date ("2024-12-18T00:00:00")
})