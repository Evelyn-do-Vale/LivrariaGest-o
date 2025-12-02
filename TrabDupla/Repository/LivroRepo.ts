import BaseRepo from "./BaseRepo";

export default class LivroRepo extends BaseRepo {
    async criarLivro(livro: { id: string; titulo: string; genero?: string; preco?: number }) {
        await this.db.run(
            'INSERT INTO livros (id, titulo, genero, preco) VALUES (?, ?, ?, ?);',
            [livro.id, livro.titulo, livro.genero ?? null, livro.preco ?? 0]
        );

        return livro;
    }

    async attachAuthor(livroId: string, autorId: string) {
        await this.db.run(
            'INSERT OR IGNORE INTO livro_autor (livro_id, autor_id) VALUES (?, ?);',
            [livroId, autorId]
        );
    }

    async all() {
        return await this.db.all('SELECT * FROM livros');
    }

    async findById(id: string) {
        return await this.db.get(
            'SELECT * FROM livros WHERE id = ?',
            [id]
        );
    }

    async update(id: string, changes: any) {
        const l = await this.findById(id);
        if (!l) return null;
        await this.db.run(
            'UPDATE livros SET titulo = ?, genero = ?, preco = ? WHERE id = ?',
            [
                changes.titulo ?? l.titulo,
                changes.genero ?? l.genero,
                changes.preco ?? l.preco,
                id
            ]
        );
        return this.findById(id);
    }
    async delete(id: string) {
        return await this.db.run('DELETE FROM livros WHERE id = ?', [id]);
    }
}