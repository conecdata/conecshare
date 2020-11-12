USE modelo_conecdata;

CREATE TABLE grupos (
  gru_pk int(11) NOT NULL,
  gru_b_ativo tinyint(4) UNSIGNED NOT NULL DEFAULT '1',
  gru_c_grupo varchar(40) CHARACTER SET utf8 DEFAULT NULL
);

ALTER TABLE grupos ADD PRIMARY KEY (gru_pk);

ALTER TABLE grupos MODIFY gru_pk int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES
(1, 1, 'Diversos'),
(2, 1, 'Bebidas'),
(3, 1, 'Açougue'),
(4, 1, 'Cereais'),
(5, 1, 'Enlatados');
