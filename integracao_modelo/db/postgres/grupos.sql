CREATE TABLE public.grupos (
  gru_pk serial NOT NULL,
  gru_b_ativo bool NOT NULL DEFAULT true,
  gru_c_grupo varchar(40) NULL DEFAULT NULL::character varying
);

ALTER TABLE public.grupos ADD CONSTRAINT grupos_pk PRIMARY KEY (gru_pk);

INSERT INTO public.grupos VALUES (1, true, 'Diversos');
INSERT INTO public.grupos VALUES (2, true, 'Bebidas');
INSERT INTO public.grupos VALUES (3, true, 'Açougue');
INSERT INTO public.grupos VALUES (4, true, 'Cereais');
INSERT INTO public.grupos VALUES (5, true, 'Enlatados');
