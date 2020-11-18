CREATE TABLE grupos
(
    gru_pk INT NOT NULL PRIMARY KEY,
    gru_b_ativo VARCHAR(1) DEFAULT 'T',
    gru_c_grupo CHAR(40) DEFAULT NULL
);

/* ALTER TABLE grupos ADD PRIMARY KEY (gru_pk); */

INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES (1, 'T', 'Diversos');
INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES (2, 'T', 'Bebidas');
INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES (3, 'T', 'Açougue');
INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES (4, 'T', 'Cereais');
INSERT INTO grupos (gru_pk, gru_b_ativo, gru_c_grupo) VALUES (5, 'T', 'Enlatados');
