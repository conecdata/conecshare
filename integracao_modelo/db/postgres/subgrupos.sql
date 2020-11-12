CREATE TABLE public.subgrupos (
  sub_pk serial NOT NULL,
  sub_c_subgrupo varchar(40) NULL DEFAULT NULL::character varying,
  sub_b_ativo bool NOT NULL DEFAULT true
);

ALTER TABLE public.subgrupos ADD CONSTRAINT subgrupos_pk PRIMARY KEY (sub_pk);

INSERT INTO public.subgrupos VALUES (1, 'Limpeza', true);
INSERT INTO public.subgrupos VALUES (2, 'Sujeira', true);