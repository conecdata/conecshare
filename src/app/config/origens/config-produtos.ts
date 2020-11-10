// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_PRODUTOS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: 'db', // 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos
  nomeView: 'view_conecdata_produtos', // db
}

// VERSÃO SIMPLIFICADA
/*
  DROP VIEW IF EXISTS view_conecdata_produtos;

  CREATE VIEW
    view_conecdata_produtos
  AS SELECT
    pro_pk AS idProduto,
    pro_c_barcode AS barcodeProduto,
    pro_f_preco AS precoVenda,
    
    pro_fk_grupo AS idDepartamento,
    gru_c_grupo AS nomeDepartamento,
    gru_b_ativo AS ativoDepartamento,
    
    0 AS idSubdepartamento,
    '' AS nomeSubdepartamento,
    0 AS ativoSubdepartamento,
    
    1 AS industrializado,
    '' AS nomeProduto,
        
    0 AS estoqueControlado,
    0 AS qtdeEstoqueMinimo,
    0 AS qtdeEstoqueAtual,
    
    0 AS atacadoQtde,
    0 AS atacadoValor,
    
    0 AS percentualLimiteVenda,
    0 AS qtdeLimiteVenda,    
  
    0 AS pesavelStatus,
    0 AS pesavelFracao,
    '' AS pesavelTipo,
    
    1 AS produtoAtivo,
   
    '' AS descricaoProduto,

    0 AS destaque,
    
    '1' AS idLoja
  FROM
    produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
*/

//  VERSÃO COMPLETA 
/* 
  DROP VIEW view_conecdata_produtos;

  CREATE VIEW
    view_conecdata_produtos
  AS SELECT
    pro_pk AS idProduto,
    pro_c_barcode AS barcodeProduto,
    pro_f_preco AS precoVenda,
    
    pro_fk_grupo AS idDepartamento,
    gru_c_grupo AS nomeDepartamento,
    gru_b_ativo AS ativoDepartamento,
    
    pro_fk_subgrupo AS idSubdepartamento,
    sub_c_subgrupo AS nomeSubdepartamento,
    sub_b_ativo AS ativoSubdepartamento,
    
    pro_b_industrializado AS industrializado,
    pro_c_produto AS nomeProduto,
        
    pro_b_estoque AS estoqueControlado,
    pro_f_est_min AS qtdeEstoqueMinimo,
    pro_f_est_qtde_loja AS qtdeEstoqueAtual,
    
    pro_f_qtde_atacado AS atacadoQtde,
    pro_f_valor_atacado AS atacadoValor,
    
    pro_f_perc_limite_venda AS percentualLimiteVenda,
    pro_f_qtde_limite_venda AS qtdeLimiteVenda,    
  
    pro_b_fracionado AS pesavelStatus,
    pro_f_pesavel_fracao AS pesavelFracao,
    pro_c_pesavel_tipo AS pesavelTipo,
    
    pro_b_ativo AS produtoAtivo,
   
    pro_c_descricao AS descricaoProduto,

    pro_b_destaque AS destaque,
    
    '1' AS idLoja
  FROM
    produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN
    subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk
*/
