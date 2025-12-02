export function GerarSenha(tamanho: number = 8): string {
    const caracteres = "ABCDEabcde0123456789@#$%";
    return Array.from({ length: tamanho }, () =>
        caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join("");
}