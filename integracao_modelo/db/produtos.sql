USE modelo_conecdata;

CREATE TABLE produtos (
  pro_pk int(11) NOT NULL,
  pro_fk_grupo int(11) DEFAULT NULL,
  pro_fk_subgrupo int(11) NOT NULL,
  pro_b_ativo tinyint(3) UNSIGNED DEFAULT '1',
  pro_b_estoque tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  pro_b_fracionado tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  pro_c_barcode varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  pro_c_produto varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  pro_c_img varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  pro_i_cod int(10) UNSIGNED DEFAULT NULL,
  pro_c_descricao varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  pro_f_preco decimal(10,2) NOT NULL DEFAULT '0.00',
  pro_b_favorito tinyint(4) NOT NULL DEFAULT '0',
  pro_b_balanca tinyint(4) NOT NULL DEFAULT '0',
  pro_f_qtde_estoque_loja decimal(10,2) NOT NULL DEFAULT '0.00',
  pro_f_qtde_estoque_loja decimal(10,2) NOT NULL DEFAULT '0.00',
  pro_f_qtde_estoque_min decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE produtos ADD PRIMARY KEY (pro_pk);

ALTER TABLE produtos MODIFY pro_pk int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO produtos (pro_pk, pro_fk_grupo, pro_fk_subgrupo, pro_b_ativo, pro_b_estoque, pro_b_fracionado, pro_c_barcode, pro_c_produto, pro_c_img, pro_i_cod, pro_c_descricao, pro_f_preco, pro_b_favorito, pro_b_balanca, pro_f_qtde_estoque_loja, pro_f_qtde_estoque_min) VALUES
(416, 1, 0, 1, 0, 0, '7896020417149', 'THREE BOND 2G TRADICIONAL', '', 416, '', '2.00', 0, 0, '0.00', '0.00'),
(1004, 1, 0, 1, 0, 0, '7891132007486', 'VONO SOPA MILHO C/FRANGO 15G', '', 15257, '', '2.25', 0, 0, '0.00', '0.00'),
(1065, 2, 0, 1, 0, 0, '7894900010015', 'REFRIGERANTE COCA COLA LATA  350ML', '', 1004, '', '2.50', 0, 0, '0.00', '0.00'),
(1423, 1, 0, 1, 0, 0, '7896007912124', 'FOSFORO FIAT LUX', '', 1362, '', '3.50', 0, 0, '0.00', '0.00'),
(1757, 1, 0, 1, 0, 0, '7891962011295', 'TORRADA BAUDUCCO LIGHT 160G', '', 1696, '', '3.00', 0, 0, '0.00', '0.00'),
(1761, 1, 0, 1, 0, 0, '7891000919705', 'BISCOITO  LEITE E MEL 200G NESFIT', '', 1700, '', '3.00', 0, 0, '0.00', '0.00'),
(1774, 2, 0, 1, 0, 0, '7894900551051', 'DEL VALLE FRUT LIMAO 450ML', '', 1713, '', '2.00', 0, 0, '0.00', '0.00'),
(1775, 2, 0, 1, 0, 0, '7894900556056', 'DEL VALLE FRUT CITRUS PUNCH 450ML', '', 1714, '', '2.00', 0, 0, '0.00', '0.00'),
(1776, 2, 0, 1, 0, 0, '7894900550054', 'DEL VALLE FRUT UVA 450ML', '', 1715, '', '2.00', 0, 0, '0.00', '0.00'),
(2086, 2, 0, 1, 0, 0, '7896000554369', 'SUCO MAGUARY CONCENTRADO CAJU 500ML', '', 2013, '', '3.75', 0, 0, '0.00', '0.00'),
(2095, 2, 0, 1, 0, 0, '7894900603705', 'KAPO ABACAXI 200ML', '', 2022, '', '2.00', 0, 0, '0.00', '0.00'),
(2105, 2, 0, 1, 0, 0, '7894900552058', 'DEL VALLE FRUT TANGERINA 450 ML', '', 2032, '', '2.00', 0, 0, '0.00', '0.00'),
(2108, 2, 0, 1, 0, 0, '7894900563702', 'KAPO LARANJA 200ML', '', 2035, '', '2.00', 0, 0, '0.00', '0.00'),
(2451, 1, 0, 1, 0, 0, '7892300000698', 'CUSCUZ SINHÁ 500G', '', 2378, '', '1.75', 0, 0, '0.00', '0.00'),
(2607, 1, 0, 1, 0, 0, '7898288540027', 'TORRESMO SABOR DE MINAS FRITO 100G', '', 2534, '', '5.00', 0, 0, '0.00', '0.00'),
(2785, 2, 0, 1, 0, 0, '78910942', 'GUARANA ANTARTICA CAÇULINHA 237ML', '', 2712, '', '1.50', 0, 0, '0.00', '0.00'),
(3435, 5, 0, 1, 0, 0, '7896102502213', 'EXTRATO DE TOMATE QUERO COPO 190G', '', 3356, '', '3.00', 0, 0, '0.00', '0.00'),
(3471, 5, 0, 1, 0, 0, '7896292305793', 'MOLHO PARA CARNES MADEIRA SACH� 340G', '', 3392, '', '4.75', 0, 0, '0.00', '0.00'),
(20151, 1, 0, 1, 0, 0, '7891000115633', 'RAÇÃO DE CARNE DOG 100G PURINA', '', 265808, '', '2.25', 0, 0, '0.00', '0.00'),
(20400, 4, 0, 1, 0, 0, '7891000255445', 'CRUNCH CEREAL NESTLÉ 120G', '', 266057, '', '4.75', 0, 0, '0.00', '0.00'),
(20953, 1, 0, 1, 0, 0, '7891000115763', 'FRISKIES CARNE 85G', '', 266585, '', '2.25', 0, 0, '0.00', '0.00'),
(21386, 2, 0, 1, 0, 0, '7622300999308', 'SUCO FRESH 10G', '', 267013, '', '0.69', 0, 0, '0.00', '0.00'),
(21387, 2, 0, 1, 0, 0, '7622300999506', 'SUCO FRESH TANGERINA  10G', '', 267014, '', '0.69', 0, 0, '0.00', '0.00'),
(21388, 2, 0, 1, 0, 0, '7622300999131', 'SUCO FRESH ABACAXI 10G', '', 267015, '', '0.69', 0, 0, '0.00', '0.00'),
(21389, 2, 0, 1, 0, 0, '7622300999544', 'SUCO FRESH UVA 10G', '', 267016, '', '0.69', 0, 0, '0.00', '0.00'),
(21390, 2, 0, 1, 0, 0, '7622300999469', 'SUCO FRESH MORANGO 10G', '', 267017, '', '0.69', 0, 0, '0.00', '0.00'),
(21702, 2, 0, 1, 0, 0, '7622300999261', 'SUCO FRESH GUARANA 10G', '', 267328, '', '0.69', 0, 0, '0.00', '0.00'),
(21703, 2, 0, 1, 0, 0, '7622300999223', 'SUCO FRESH CAJU 10G', '', 267329, '', '0.69', 0, 0, '0.00', '0.00'),
(21954, 2, 0, 1, 0, 0, '7622300999384', 'SUCO FRESH MANGA 10G', '', 267578, '', '0.75', 0, 0, '0.00', '0.00'),
(21955, 2, 0, 1, 0, 0, '7622300999421', 'SUCO FRESH MARACUJA 10G', '', 267579, '', '0.69', 0, 0, '0.00', '0.00');

