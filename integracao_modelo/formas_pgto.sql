USE modelo_conecdata;

CREATE TABLE formas_pgto (
  fpg_pk int(11) NOT NULL,
  fpg_c_forma varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  fpg_c_legenda varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  fpg_c_id_externo varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE formas_pgto ADD PRIMARY KEY (fpg_pk);

ALTER TABLE formas_pgto MODIFY fpg_pk int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO formas_pgto (fpg_pk, fpg_c_forma, fpg_c_legenda, fpg_c_id_externo) VALUES
(1, 'Dinheiro', 'Dinheiro', 'dinheiro'),
(2, 'Debito - Elo', 'Débito', 'PwSVMxJoIycndIqFlD0D'),
(3, 'Debito - Maestro', 'Débito', 'WHyA85977R3MqItEiYY4'),
(4, 'Debito - Redeshop', 'Débito', NULL),
(5, 'Debito - Visa Electron', 'Débito', NULL),
(6, 'Credito - American express', 'Crédito', 'MhoNW0SPw6Ed18SxhwuM'),
(7, 'Credito - Diners', 'Crédito', NULL),
(8, 'Credito - Elo', 'Crédito', 'lKPN6jEKtlbkWcYK0kxA'),
(9, 'Credito - Hipercard', 'Crédito', 'mrnbHvRpJXTIlJfAAP8U'),
(10, 'Credito - Mastercard', 'Crédito', '5rD56DyivnVIeHuokY2x'),
(11, 'Credito - Policard', 'Crédito', 'kWpZ6xKCdYKqayb58zft'),
(12, 'Credito - ValeCard', 'Crédito', 'aRwxjU2td8vptpfCEqLP'),
(13, 'Credito - Visa', 'Crédito', 'tvOVBTfahQnXjPiVaegI'),
(14, 'Cheque', 'Cheque', '0sEHjTamqKGD7HiSv1xs'),
(15, 'Alelo - Alimentacao', 'Alimentação', '0Na3tq1CVIi8CPTKOgXy'),
(16, 'Alelo - Refeicao', 'Refeição', 'U4w7EsYdxNvAekBshg2E'),
(17, 'Policard - Alimentacao', 'Alimentação', 'v3UkHSI3KjEls49AwhlZ'),
(18, 'Policard - Refeicao', 'Refeição', 'FBBCsGn58UXziZenF3tk'),
(19, 'Sodexo - Refeicao', 'Refeição', 'dMwVjV69GQfxTEzoPuCG'),
(20, 'Ticket Rest. Eletronico', 'Ticket Rest.', 'HLlurM6zoz1MycAHk9pm'),
(21, 'ValeCard - Alimentacao', 'Alimentação', 'Lzc2Cut6Ke4Uak9qHAb9'),
(22, 'ValeCard - Refeicao', 'Refeição', 'zk04kpCR1L1UKa86JPmw'),
(23, 'Visa - Vale', 'Visa Vale', 'nKD3GEVoA1en7DYsqjFK'),
(24, 'Voucher', 'Voucher', '6gfFyhAgdSEncD0PpeN6'),
(25, 'Desconto', 'Desconto', NULL);
