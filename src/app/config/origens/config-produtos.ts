// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_PRODUTOS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: 'csv', // 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos
  nomeView: 'conecdata_produtos', // db
}

/*
  DROP VIEW conecdata_produtos;

  CREATE VIEW
    conecdata_produtos
  AS SELECT
    pro_pk AS idProduto,
    pro_b_estoque AS estoqueControlado,
    pro_c_barcode AS barcodeProduto,
    pro_c_produto AS nomeProduto,
    pro_f_preco AS precoVenda,
    pro_fk_grupo AS idDepartamento,
    gru_c_grupo AS nomeDepartamento,
    gru_b_ativo AS ativoDepartamento,
    '1' AS idLoja,
    0 AS atacadoQtde,
    0 AS atacadoValor,
    1 AS industrializado,

    pro_fk_subgrupo AS idSubdepartamento,
    sub_c_subgrupo AS nomeSubdepartamento,
    sub_b_ativo AS ativoSubdepartamento,
    pro_b_ativo AS produtoAtivo,
    pro_b_fracionado AS pesavelStatus,
    0 AS pesavelFracao,
    '' AS pesavelTipo,
    pro_c_descricao AS descricaoProduto,
    1 AS vitrine,
    pro_f_est_min AS qtdeEstoqueMinimo,
    pro_f_est_qtde_loja AS qtdeEstoqueAtual
  FROM
    produtos_ok AS produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN
    subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk

  LEFT JOIN
    lojas ON produtos.pro_fk_loja = loja.loj_pk
*/