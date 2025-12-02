import BaseRepo from "./BaseRepo";

export default class LogRepo extends BaseRepo {
    async criarLog(usuario_id: string | null, acao: string) {
        await this.db.run(
            'INSERT INTO Logs (usuario_id, acao, data_hora) VALUES (?, ?, ?);',
            [usuario_id, acao, new Date().toISOString()]
        );

        return true;
    }

    all() {
        return this.db.all('SELECT * FROM Logs ORDER BY id DESC');
    }
}