export function gerarSenha (tamanho: number = 8):
string {
    const caracteres = "ABCDEabcde0123456789@#$%"
    return Array.from({length: tamanho}, ()=>
    caracteres.charAt(Math.floor(Math.random()*caracteres.length))
    ).join("")
}

export function validarSenha(senhaDigitada: string, senhaCorreta: string) {
    if (senhaDigitada !== senhaCorreta) {
        throw new Error("Senha incorreta.");
    }

    return true;
}