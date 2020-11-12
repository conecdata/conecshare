USE modelo_conecdata;

CREATE TABLE subgrupos (
  sub_pk int(11) NOT NULL,
  sub_c_subgrupo varchar(40) DEFAULT NULL,
  sub_b_ativo tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE subgrupos ADD PRIMARY KEY (sub_pk);

ALTER TABLE subgrupos MODIFY sub_pk int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO subgrupos (sub_pk, sub_c_subgrupo, sub_b_ativo) VALUES
(1, 'Sub 1', 1),
(2, 'Sub 2', 1);