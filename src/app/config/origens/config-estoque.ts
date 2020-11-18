// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_ESTOQUE = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: '',  // 'fb', 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos
  nomeView: '', // db/fb
}

/* Mysql
  DROP VIEW IF EXISTS view_conecdata_estoque;

  CREATE VIEW
    view_conecdata_estoque
  AS SELECT
    pro_pk AS id_produto,
    pro_b_estoque AS estoque_controlado,
    pro_c_barcode AS barcode_produto,
    pro_c_produto AS nome_produto,
    1 AS id_loja,
    pro_f_qtde_estoque_min AS qtde_estoque_minimo,
    pro_f_qtde_estoque_loja AS qtde_estoque_atual
  FROM
    produtos
  WHERE
    pro_b_estoque > 0
*/

/* Postgres
  WHERE
    pro_b_estoque = true
*/