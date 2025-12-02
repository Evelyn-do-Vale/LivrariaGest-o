interface Log {
    id?: number;
    tipo: string;
    descricao: string;
    id_usuario: number;
    id_funcionario: number;
    data: Date;
}

export default Log;