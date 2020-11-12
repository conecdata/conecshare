CREATE TABLE public.produtos (
  pro_pk serial NOT NULL,
  pro_fk_grupo int4 NULL,
  pro_fk_subgrupo int4 NOT NULL,
  pro_b_ativo bool NOT NULL DEFAULT true,
  pro_b_balanca bool NOT NULL DEFAULT false,
  pro_b_destaque bool NOT NULL DEFAULT false,
  pro_b_estoque bool NOT NULL DEFAULT false,
  pro_b_favorito bool NOT NULL DEFAULT false,
  pro_b_fracionado bool NOT NULL DEFAULT false,
  pro_b_industrializado bool NOT NULL DEFAULT true,
  pro_c_barcode varchar(20) NULL DEFAULT NULL::character varying,
  pro_c_descricao varchar(60) NULL DEFAULT NULL::character varying,
  pro_c_img varchar(60) NULL DEFAULT NULL::character varying,
  pro_c_pesavel_tipo varchar(5) NULL DEFAULT NULL::character varying,
  pro_c_produto varchar(60) NULL DEFAULT NULL::character varying,
  pro_f_perc_limite_venda numeric(10,2) NULL DEFAULT 0,
  pro_f_pesavel_fracao numeric(10,2) NULL DEFAULT 0,
  pro_f_preco numeric(10,2) NULL DEFAULT 0,
  pro_f_qtde_atacado numeric(10,2) NULL DEFAULT 0,
  pro_f_qtde_estoque_loja numeric(10,2) NULL DEFAULT 0,
  pro_f_qtde_estoque_min numeric(10,2) NULL DEFAULT 0,
  pro_f_qtde_limite_venda numeric(10,2) NULL DEFAULT 0,
  pro_f_valor_atacado numeric(10,2) NULL DEFAULT 0,
  pro_i_cod int4 NULL DEFAULT NULL,
  cod_1 int4 NULL DEFAULT NULL,
  cod_2 int4 NULL DEFAULT NULL
);

ALTER TABLE public.produtos ADD CONSTRAINT produtos_pk PRIMARY KEY (pro_pk);

INSERT INTO public.produtos (pro_fk_grupo,pro_fk_subgrupo,pro_b_ativo,pro_b_balanca,pro_b_destaque,pro_b_estoque,pro_b_favorito,pro_b_fracionado,pro_b_industrializado,pro_c_barcode,pro_c_descricao,pro_c_img,pro_c_pesavel_tipo,pro_c_produto,pro_f_perc_limite_venda,pro_f_pesavel_fracao,pro_f_preco,pro_f_qtde_atacado,pro_f_qtde_estoque_loja,pro_f_qtde_estoque_min,pro_f_qtde_limite_venda,pro_f_valor_atacado,pro_i_cod) VALUES 
(1,0,true,false,false,true,false,false,true,'7896020417149','','',NULL,'THREE BOND 2G TRADICIONAL',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,416)
,(1,0,true,false,false,true,false,false,true,'7891132007486','','',NULL,'VONO SOPA MILHO C/FRANGO 15G',0.00,0.00,2.25,0.00,0.00,0.00,0.00,0.00,15257)
,(1,0,true,false,false,true,false,false,true,'7896007912124','','',NULL,'FOSFORO FIAT LUX',0.00,0.00,3.50,0.00,0.00,0.00,0.00,0.00,1362)
,(1,0,true,false,false,true,false,false,true,'7891962011295','','',NULL,'TORRADA BAUDUCCO LIGHT 160G',0.00,0.00,3.00,0.00,0.00,0.00,0.00,0.00,1696)
,(1,0,true,false,false,true,false,false,true,'7891000919705','','',NULL,'BISCOITO  LEITE E MEL 200G NESFIT',0.00,0.00,3.00,0.00,0.00,0.00,0.00,0.00,1700)
,(2,0,true,false,false,true,false,false,true,'7894900551051','','',NULL,'DEL VALLE FRUT LIMAO 450ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,1713)
,(2,0,true,false,false,true,false,false,true,'7894900556056','','',NULL,'DEL VALLE FRUT CITRUS PUNCH 450ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,1714)
,(2,0,true,false,false,true,false,false,true,'7894900550054','','',NULL,'DEL VALLE FRUT UVA 450ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,1715)
,(2,0,true,false,false,true,false,false,true,'7896000554369','','',NULL,'SUCO MAGUARY CONCENTRADO CAJU 500ML',0.00,0.00,3.75,0.00,0.00,0.00,0.00,0.00,2013)
,(2,0,true,false,false,true,false,false,true,'7894900603705','','',NULL,'KAPO ABACAXI 200ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,2022)
,(2,0,true,false,false,true,false,false,true,'7894900552058','','',NULL,'DEL VALLE FRUT TANGERINA 450 ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,2032)
,(2,0,true,false,false,true,false,false,true,'7894900563702','','',NULL,'KAPO LARANJA 200ML',0.00,0.00,2.00,0.00,0.00,0.00,0.00,0.00,2035)
,(1,0,true,false,false,true,false,false,true,'7892300000698','','',NULL,'CUSCUZ SINHÁ 500G',0.00,0.00,1.75,0.00,0.00,0.00,0.00,0.00,2378)
,(1,0,true,false,false,true,false,false,true,'7898288540027','','',NULL,'TORRESMO SABOR DE MINAS FRITO 100G',0.00,0.00,5.00,0.00,0.00,0.00,0.00,0.00,2534)
,(2,0,true,false,false,true,false,false,true,'78910942','','',NULL,'GUARANA ANTARTICA CAÇULINHA 237ML',0.00,0.00,1.50,0.00,0.00,0.00,0.00,0.00,2712)
,(5,0,true,false,false,true,false,false,true,'7896102502213','','',NULL,'EXTRATO DE TOMATE QUERO COPO 190G',0.00,0.00,3.00,0.00,0.00,0.00,0.00,0.00,3356)
,(1,0,true,false,false,true,false,false,true,'7891000115633','','',NULL,'RAÇÃO DE CARNE DOG 100G PURINA',0.00,0.00,2.25,0.00,0.00,0.00,0.00,0.00,265808)
,(4,0,true,false,false,true,false,false,true,'7891000255445','','',NULL,'CRUNCH CEREAL NESTLÉ 120G',0.00,0.00,4.75,0.00,0.00,0.00,0.00,0.00,266057)
,(1,0,true,false,false,true,false,false,true,'7891000115763','','',NULL,'FRISKIES CARNE 85G',0.00,0.00,2.25,0.00,0.00,0.00,0.00,0.00,266585)
,(2,0,true,false,false,true,false,false,true,'7622300999308','','',NULL,'SUCO FRESH 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267013)
,(2,0,true,false,false,true,false,false,true,'7622300999506','','',NULL,'SUCO FRESH TANGERINA  10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267014)
,(2,0,true,false,false,true,false,false,true,'7622300999131','','',NULL,'SUCO FRESH ABACAXI 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267015)
,(2,0,true,false,false,true,false,false,true,'7622300999544','','',NULL,'SUCO FRESH UVA 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267016)
,(2,0,true,false,false,true,false,false,true,'7622300999469','','',NULL,'SUCO FRESH MORANGO 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267017)
,(2,0,true,false,false,true,false,false,true,'7622300999261','','',NULL,'SUCO FRESH GUARANA 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267328)
,(2,0,true,false,false,true,false,false,true,'7622300999223','','',NULL,'SUCO FRESH CAJU 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267329)
,(2,0,true,false,false,true,false,false,true,'7622300999384','','',NULL,'SUCO FRESH MANGA 10G',0.00,0.00,0.75,0.00,0.00,0.00,0.00,0.00,267578)
,(5,0,true,false,false,true,false,false,true,'7896292305793','','',NULL,'MOLHO PARA CARNES MADEIRA SACHÊ 340G',0.00,0.00,4.75,0.00,0.00,0.00,0.00,0.00,3392)
,(2,0,true,false,false,true,false,false,true,'7894900010015','','',NULL,'REFRIGERANTE COCA COLA LATA  350ML',0.00,0.00,2.50,0.00,0.00,0.00,0.00,0.00,1004)
,(2,0,true,false,false,true,false,false,true,'7622300999421','','',NULL,'SUCO FRESH MARACUJA 10G',0.00,0.00,0.69,0.00,0.00,0.00,0.00,0.00,267579)
;