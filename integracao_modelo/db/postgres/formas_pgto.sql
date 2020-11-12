CREATE TABLE public.formas_pgto (
    fpg_pk serial NOT NULL,
    fpg_c_forma character varying(40) DEFAULT NULL::character varying,
    fpg_c_legenda character varying(40) DEFAULT NULL::character varying,
    fpg_c_id_externo character varying(40) DEFAULT NULL::character varying
);

ALTER TABLE public.formas_pgto ADD CONSTRAINT formas_pgto_pk PRIMARY KEY (fpg_pk);

INSERT INTO public.formas_pgto VALUES (1, 'Dinheiro', 'Dinheiro', 'dinheiro');
INSERT INTO public.formas_pgto VALUES (2, 'Debito - Elo', 'Débito', 'debito_elo');
INSERT INTO public.formas_pgto VALUES (3, 'Debito - Maestro', 'Débito', 'debito_maestro');
INSERT INTO public.formas_pgto VALUES (4, 'Debito - Redeshop', 'Débito', NULL);
INSERT INTO public.formas_pgto VALUES (5, 'Debito - Visa Electron', 'Débito', NULL);
INSERT INTO public.formas_pgto VALUES (6, 'Credito - American express', 'Crédito', 'credito_amex');
INSERT INTO public.formas_pgto VALUES (7, 'Credito - Diners', 'Crédito', NULL);
INSERT INTO public.formas_pgto VALUES (8, 'Credito - Elo', 'Crédito', 'credito_elo');
INSERT INTO public.formas_pgto VALUES (9, 'Credito - Hipercard', 'Crédito', 'credito_hipercard');
INSERT INTO public.formas_pgto VALUES (10, 'Credito - Mastercard', 'Crédito', 'credito_mastercard');
INSERT INTO public.formas_pgto VALUES (11, 'Credito - Policard', 'Crédito', 'credito_policard');
INSERT INTO public.formas_pgto VALUES (12, 'Credito - ValeCard', 'Crédito', 'credito_valecard');
INSERT INTO public.formas_pgto VALUES (13, 'Credito - Visa', 'Crédito', 'credito_visa');
INSERT INTO public.formas_pgto VALUES (14, 'Cheque', 'Cheque', 'cheque');
INSERT INTO public.formas_pgto VALUES (15, 'Alelo - Alimentacao', 'Alimentação', 'alelo_alimentacao');
INSERT INTO public.formas_pgto VALUES (16, 'Alelo - Refeicao', 'Refeição', 'alelo_refeicao');
INSERT INTO public.formas_pgto VALUES (17, 'Policard - Alimentacao', 'Alimentação', 'policard_alimentacao');
INSERT INTO public.formas_pgto VALUES (18, 'Policard - Refeicao', 'Refeição', 'policard_refeicao');
INSERT INTO public.formas_pgto VALUES (19, 'Sodexo - Refeicao', 'Refeição', 'sodexo_refeicao');
INSERT INTO public.formas_pgto VALUES (20, 'Ticket Rest. Eletronico', 'Ticket Rest.', 'ticket_rest_eletronico');
INSERT INTO public.formas_pgto VALUES (21, 'ValeCard - Alimentacao', 'Alimentação', 'valecard_alimentacao');
INSERT INTO public.formas_pgto VALUES (22, 'ValeCard - Refeicao', 'Refeição', 'valecard_refeicao');
INSERT INTO public.formas_pgto VALUES (23, 'Visa - Vale', 'Visa Vale', 'visa_vale');
INSERT INTO public.formas_pgto VALUES (24, 'Voucher', 'Voucher', 'voucher');
INSERT INTO public.formas_pgto VALUES (25, 'Desconto', 'Desconto', NULL);
