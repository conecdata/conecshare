CREATE TABLE subgrupos
(
    sub_pk INT NOT NULL PRIMARY KEY,
    sub_b_ativo VARCHAR(1) DEFAULT 'T',
    sub_c_subgrupo CHAR(40) DEFAULT NULL
);

INSERT INTO subgrupos (sub_pk, sub_b_ativo, sub_c_subgrupo) VALUES (1, 'T', 'Sub 1');
INSERT INTO subgrupos (sub_pk, sub_b_ativo, sub_c_subgrupo) VALUES (2, 'T', 'Sub 2');
