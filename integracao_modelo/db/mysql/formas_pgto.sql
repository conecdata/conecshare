USE modelo_conecdata;

CREATE TABLE formas_pgto (
  fpg_pk int(11) NOT NULL,
  fpg_c_forma varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  fpg_c_legenda varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  fpg_c_id_externo varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE formas_pgto ADD PRIMARY KEY (fpg_pk);

ALTER TABLE formas_pgto MODIFY fpg_pk int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO formas_pgto (fpg_pk, fpg_c_forma, fpg_c_legenda, fpg_c_id_externo) VALUES
(1, 'Dinheiro', 'Dinheiro', 'dinheiro'),
(2, 'Debito - Elo', 'Débito', 'debito_elo'),
(3, 'Debito - Maestro', 'Débito', 'debito_maestro'),
(4, 'Debito - Redeshop', 'Débito', NULL),
(5, 'Debito - Visa Electron', 'Débito', NULL),
(6, 'Credito - American express', 'Crédito', 'credito_amex'),
(7, 'Credito - Diners', 'Crédito', NULL),
(8, 'Credito - Elo', 'Crédito', 'credito_elo'),
(9, 'Credito - Hipercard', 'Crédito', 'credito_hipercard'),
(10, 'Credito - Mastercard', 'Crédito', 'credito_mastercard'),
(11, 'Credito - Policard', 'Crédito', 'credito_policard'),
(12, 'Credito - ValeCard', 'Crédito', 'credito_valecard'),
(13, 'Credito - Visa', 'Crédito', 'credito_visa'),
(14, 'Cheque', 'Cheque', 'cheque'),
(15, 'Alelo - Alimentacao', 'Alimentação', 'alelo_alimentacao'),
(16, 'Alelo - Refeicao', 'Refeição', 'alelo_refeicao'),
(17, 'Policard - Alimentacao', 'Alimentação', 'policard_alimentacao'),
(18, 'Policard - Refeicao', 'Refeição', 'policard_refeicao'),
(19, 'Sodexo - Refeicao', 'Refeição', 'sodexo_refeicao'),
(20, 'Ticket Rest. Eletronico', 'Ticket Rest.', 'ticket_rest_eletronico'),
(21, 'ValeCard - Alimentacao', 'Alimentação', 'valecard_alimentacao'),
(22, 'ValeCard - Refeicao', 'Refeição', 'valecard_refeicao'),
(23, 'Visa - Vale', 'Visa Vale', 'visa_vale'),
(24, 'Voucher', 'Voucher', 'voucher'),
(25, 'Desconto', 'Desconto', NULL);
