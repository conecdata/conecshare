// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_FORMAS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: '', // 'fb', 'db' | 'csv' | ''

  // Nome da view do cadastro de formas pgto
  nomeView: '', // db/fb
}

/* Mysql
  DROP VIEW IF EXISTS view_conecdata_formas;

  CREATE VIEW
    view_conecdata_formas
  AS SELECT
    fpg_pk AS id_interno,
    fpg_c_forma AS nome_forma,
    fpg_c_id_externo AS id_externo,
    1 AS id_loja,
    1 AS forma_ativa
  FROM
    formas_pgto
  WHERE
    fpg_c_id_externo IS NOT NULL;
*/