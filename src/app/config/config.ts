export const CONFIG = {
  db: {
    conexao: {
      host: 'localhost',
      tabela: 'hypico',
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
  api: {
    /* 
      TRUE = plataforma de testes
      FALSE = plataforma definitiva ( CUIDADO )
    */
    sandbox: true
  },
  verbose: true
}