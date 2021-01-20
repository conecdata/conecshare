// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_PRODUTOS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: 'db', // 'fb', 'db' | 'csv' | ''

  // Nome da view do cadastro de produtos
  nomeView: 'view_conecdata_produtos', // db/fb
}

// VERSÃO SIMPLIFICADA
/* Mysql
  DROP VIEW IF EXISTS view_conecdata_produtos;

  CREATE VIEW
    view_conecdata_produtos
  AS SELECT
    pro_pk AS id_produto,
    pro_c_barcode AS barcode_produto,
    pro_f_preco AS preco_venda,
    
    pro_fk_grupo AS id_departamento,
    gru_c_grupo AS nome_departamento,
    gru_b_ativo AS ativo_departamento,
    1 AS online_departamento,
    
    0 AS id_subdepartamento,
    '' AS nome_subdepartamento,
    0 AS ativo_subdepartamento,
    
    1 AS industrializado,
    '' AS nome_produto,
        
    0 AS estoque_controlado,
    0 AS qtde_estoque_minimo,
    0 AS qtde_estoque_atual,
    
    0 AS atacado_qtde,
    0 AS atacado_valor,
    
    0 AS percentual_limite_venda,
    0 AS qtde_limite_venda,
  
    0 AS pesavel_status,
    0 AS pesavel_fracao,
    '' AS pesavel_tipo,
    
    1 AS ativo_produto,
    
    1 AS online_produto,
   
    '' AS descricao_produto,

    0 AS destaque,
    
    1 AS id_loja
  FROM
    produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
*/

//  VERSÃO COMPLETA
/* Mysql
  DROP VIEW view_conecdata_produtos;

  CREATE VIEW
    view_conecdata_produtos
  AS SELECT
    pro_pk AS id_produto,
    pro_c_barcode AS barcode_produto,
    pro_f_preco AS preco_venda,
    
    pro_fk_grupo AS id_departamento,
    gru_c_grupo AS nome_departamento,
    gru_b_ativo AS ativo_departamento,
    
    pro_fk_subgrupo AS id_subdepartamento,
    sub_c_subgrupo AS nome_subdepartamento,
    sub_b_ativo AS ativo_subdepartamento,
    
    pro_b_industrializado AS industrializado,
    pro_c_produto AS nome_produto,
        
    pro_b_estoque AS estoque_controlado,
    pro_f_qtde_estoque_min AS qtde_estoque_minimo,
    pro_f_qtde_estoque_loja AS qtde_estoque_atual,
    
    pro_f_qtde_atacado AS atacado_qtde,
    pro_f_valor_atacado AS atacado_valor,
    
    pro_f_perc_limite_venda AS percentual_limite_venda,
    pro_f_qtde_limite_venda AS qtde_limite_venda,
  
    pro_b_fracionado AS pesavel_status,
    pro_f_pesavel_fracao AS pesavel_fracao,
    pro_c_pesavel_tipo AS pesavel_tipo,
    
    pro_b_ativo AS ativo_produto,
   
    pro_b_online AS online,
   
    pro_c_descricao AS descricao_produto,

    pro_b_destaque AS destaque,
    
    1 AS id_loja
  FROM
    produtos
  LEFT JOIN
    grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
  LEFT JOIN
    subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk
*/

/* Firebird

DROP VIEW view_conecdata_produtos;

CREATE VIEW view_conecdata_produtos
  (
    id_produto,
    barcode_produto,
    preco_venda,

    id_departamento,
    nome_departamento,
    ativo_departamento,

    id_subdepartamento,
    nome_subdepartamento,
    ativo_subdepartamento,

    industrializado,
    nome_produto,
        
    estoque_controlado,
    qtde_estoque_minimo,
    qtde_estoque_atual,

    atacado_qtde,
    atacado_valor,

    percentual_limite_venda,
    qtde_limite_venda,

    pesavel_status,
    pesavel_fracao,
    pesavel_tipo,

    ativo_produto,

    descricao_produto,

    destaque,

    id_loja
  ) 
AS SELECT
  pro_pk,
  pro_c_barcode,
  pro_f_preco,

  pro_fk_grupo,
  gru_c_grupo,
  gru_b_ativo,

  pro_fk_subgrupo,
  sub_c_subgrupo,
  sub_b_ativo,
  
  pro_b_industrializado,
  pro_c_produto,
      
  pro_b_estoque,
  pro_f_qtde_estoque_min,
  pro_f_qtde_estoque_loja,
  
  pro_f_qtde_atacado,
  pro_f_valor_atacado,
  
  pro_f_perc_limite_venda,
  pro_f_qtde_limite_venda,

  pro_b_fracionado,
  pro_f_pesavel_fracao,
  pro_c_pesavel_tipo,
  
  pro_b_ativo,
  
  pro_c_descricao,

  pro_b_destaque,
  
  1
FROM 
  produtos
LEFT JOIN
  grupos AS departamentos ON produtos.pro_fk_grupo = departamentos.gru_pk
LEFT JOIN
  subgrupos AS subdepartamentos ON produtos.pro_fk_subgrupo = subdepartamentos.sub_pk
;
*/ 