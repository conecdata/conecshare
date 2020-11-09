// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_FORMAS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: 'csv', // 'db' | 'csv' | ''

  // Nome da view do cadastro de formas pgto
  nomeView: 'view_conecdata_formas', // db
}

/*
  DROP VIEW view_conecdata_formas;

  CREATE VIEW
    view_conecdata_formas
  AS SELECT
    fpg_pk AS idInterno,
    fpg_c_forma AS nomeForma,
    fpg_c_id_externo AS idExterno,
    '1' AS idLoja,
    1 AS formaAtiva
  FROM
    formas_pgto
  WHERE
    fpg_c_id_externo IS NOT NULL;
*/