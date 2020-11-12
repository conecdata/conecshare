export const CONFIG = {
  db: {
    conexao: {
      host: '45.178.225.94',
      tabela: 'conecsync2',
      usuario: 'cdatadb',
      senha: 'datapass@2',
      tipo: 'postgres', /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
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
    path: ''
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