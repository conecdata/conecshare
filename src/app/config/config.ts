export const CONFIG = {
  db: {
    conexao: {
      host: 'localhost',
      tabela: 'modelo_conecdata',
      usuario: 'root',
      senha: 'masterkey',
      tipo: 'mysql', /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
      /*
      $ npm install --save pg pg-hstore # Postgres
      $ npm install --save mysql2
      $ npm install --save mariadb
      $ npm install --save sqlite3
      $ npm install --save tedious # Microsoft SQL Server
      */
    },
  },
  csv: {
    path: 'D:\\conecdata\\produtos\\conecsync\\src\\assets'
  },
  /* 
    TRUE = plataforma de testes
    FALSE = plataforma definitiva ( CUIDADO )
  */
  sandbox: true,
  /* 
    TRUE = Envia mensagens para terminal (se disponível)
    FALSE = Não envia mensagens, apenas grava em arquivos de log
  */
  verbose: true
}