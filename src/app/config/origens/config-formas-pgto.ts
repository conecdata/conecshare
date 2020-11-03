// Origens de dados podem ser "views no DB" ou "paths de arquivos CSV"
export const CONFIG_FORMAS = {
  /* Tipo de origem */
  // Se '' ignora essa origem de dados (não sincroniza).
  tipo: 'csv', // 'db' | 'csv' | ''

  // Nome da view do cadastro de formas pgto
  nomeView: 'conecdata_formas', // db
}

/*
  DROP VIEW conecdata_formas;

  CREATE VIEW
    conecdata_formas
  AS SELECT
    fpg_pk AS idInterno,
    1 AS formaAtiva,
    fpg_c_forma AS nomeForma,
    fpg_c_id_externo AS idExterno,
    '1' AS idLoja
  FROM
    formas_pgto
  WHERE
    fpg_c_id_externo IS NOT NULL
*/