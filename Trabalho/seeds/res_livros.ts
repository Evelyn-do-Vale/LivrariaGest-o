import Livros from "../Modells/int_livro"
import LivroService from "../Service/LivroService"

export const l1: Livros = await LivroService.criar({
    titulo: "Dom Quixote", 
    genero: "Paródia", 
    preco: 42.00, 
    quantidade: 52
})

export const l2: Livros = await LivroService.criar({
    titulo: "O Senhor dos Anéis", 
    genero: "Fantasia", 
    preco: 53.00, 
    quantidade: 12
})

export const l3: Livros = await LivroService.criar({
    titulo: "1984", 
    genero: "Ficção distópica", 
    preco: 35.00, 
    quantidade: 31
})

export const l4: Livros = await LivroService.criar({
    titulo: "Moby Dick", 
    genero: "Ficção de aventura", 
    preco: 39.00, 
    quantidade: 64
})

export const l5: Livros = await LivroService.criar({
    titulo: "Hamlet", 
    genero: "Tragédia", 
    preco: 32.00, 
    quantidade: 18
})

export const l6: Livros = await LivroService.criar({
    titulo: "El coloquio de los perros", 
    genero: "Ficção", 
    preco: 22.00, 
    quantidade: 12
})

export const l7: Livros = await LivroService.criar({
    titulo: "O Hobbit", 
    genero: "Fantasia", 
    preco: 53.00, 
    quantidade: 17
})

export const l8: Livros = await LivroService.criar({
    titulo: "A revolução dos bichos", 
    genero: "Sátira", 
    preco: 20.00, 
    quantidade: 20
})

export const l9: Livros = await LivroService.criar({
    titulo: "Billy Budd", 
    genero: "Romance", 
    preco: 18.00, 
    quantidade: 28
})

export const l10: Livros = await LivroService.criar({
    titulo: "Romeu e Julieta", 
    genero: "Tragédia", 
    preco: 30.00, 
    quantidade: 32
})