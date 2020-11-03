// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_ESTOQUE = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: '', // 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos
  nomeView: 'conecdata_estoque', // db
}

/*
  DROP VIEW conecdata_estoque;

  CREATE VIEW
    conecdata_estoque
  AS SELECT
    pro_pk AS idProduto,
    pro_b_estoque AS estoqueControlado,
    pro_c_barcode AS barcodeProduto,
    pro_c_produto AS nomeProduto,
    '1' AS idLoja,
    pro_f_est_min AS qtdeEstoqueMinimo,
    pro_f_est_qtde_loja AS qtdeEstoqueAtual
  FROM
    produtos_ok AS produtos
  WHERE
    pro_b_estoque > 0

  LEFT JOIN
    lojas ON produtos.pro_fk_loja = loja.loj_pk
*/