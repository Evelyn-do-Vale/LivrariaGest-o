import Cargo from "./enu_Cargo";

interface Funcionario {
    id?: number;
    nome: string;
    CPF: string;
    email: string;
    senha: string;
    cargo: Cargo;
    data_contrato: Date;
}

export default Funcionario