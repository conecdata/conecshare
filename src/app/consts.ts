const { DataTypes } = require('sequelize');

// CSVs
export const PRODUTOS_REQ_FIELDS: string[] = [
  'id_produto', // INTEGER
  'id_departamento', // INTEGER
  'id_subdepartamento', // INTEGER
  'atacado_qtde', // INTEGER
  'atacado_valor', // INTEGER/FLOAT
  'ativo_departamento', // BOOLEAN
  'ativo_subdepartamento', // BOOLEAN
  'barcode_produto', // STRING
  'descricao_produto', // STRING
  'estoque_controlado', // BOOLEAN
  'industrializado', // BOOLEAN
  'nome_departamento', // STRING
  'nome_produto', // STRING
  'nome_subdepartamento', // STRING
  'percentual_limite_venda', // INTEGER/FLOAT
  'pesavel_fracao', // FLOAT
  'pesavel_status', // BOOLEAN
  'pesavel_tipo', // STRING
  'preco_venda', // FLOAT
  'produto_ativo', // BOOLEAN
  'qtde_estoque_atual', // INTEGER/FLOAT
  'qtde_estoque_minimo', // INTEGER/FLOAT
  'qtde_limite_venda', // INTEGER/FLOAT
  'destaque', // BOOLEAN
];

export const FORMAS_REQ_FIELDS: string[] = [
  'id_interno', // INTEGER
  'forma_ativa', // BOOLEAN
  'nome_forma', // STRING
  'id_externo', // STRING
];

export const ESTOQUE_REQ_FIELDS: string[] = [
  'id_produto', // STRING
  'barcode_produto', // STRING
  'nome_produto', // STRING
  'qtde_estoque_atual', // INTEGER/FLOAT
  'qtde_estoque_minimo', // INTEGER/FLOAT
];

// Apis
export const API_URL = {
  mercadeiro: {
    sandbox: 'https://us-central1-mercadeiro-896b2.cloudfunctions.net/v1',
    producao: 'https://api.mercadeiro.com.br/v1'
  }
}

// MODELS

// estoque
export const CAMPOS_ESTOQUE: any = {
  id_produto: {
    type: DataTypes.INTEGER,
    field: 'id_produto',
    primaryKey: true
  },
  estoque_controlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoque_controlado'
  },
  barcode_produto: {
    type: DataTypes.STRING,
    field: 'barcode_produto'
  },
  nome_produto: {
    type: DataTypes.STRING,
    field: 'nome_produto'
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  qtde_estoque_minimo: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_minimo'
  },
  qtde_estoque_atual: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_atual'
  },
};

// formas pgto
export const CAMPOS_FORMAS: any = {
  id_interno: {
    type: DataTypes.INTEGER,
    field: 'id_interno',
    primaryKey: true
  },
  id_externo: {
    type: DataTypes.STRING,
    field: 'id_externo'
  },
  nome_forma: {
    type: DataTypes.STRING,
    field: 'nome_forma'
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  }
};

// produtos
export const CAMPOS_PRODUTOS: any = {
  id_produto: {
    type: DataTypes.INTEGER,
    field: 'id_produto',
    primaryKey: true
  },
  id_loja: {
    type: DataTypes.INTEGER,
    field: 'id_loja'
  },
  estoque_controlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoque_controlado'
  },
  barcode_produto: {
    type: DataTypes.STRING,
    field: 'barcode_produto'
  },
  id_departamento: {
    type: DataTypes.INTEGER,
    field: 'id_departamento'
  },
  nome_departamento: {
    type: DataTypes.STRING,
    field: 'nome_departamento'
  },
  ativo_departamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativo_departamento'
  },
  nome_produto: {
    type: DataTypes.STRING,
    field: 'nome_produto'
  },
  preco_venda: {
    type: DataTypes.DECIMAL,
    field: 'preco_venda'
  },
  produto_ativo: {
    type: DataTypes.BOOLEAN,
    field: 'produto_ativo'
  },
  atacado_qtde: {
    type: DataTypes.INTEGER,
    field: 'atacado_qtde'
  },
  atacado_valor: {
    type: DataTypes.DECIMAL,
    field: 'atacado_valor'
  },
  descricao_produto: {
    type: DataTypes.STRING,
    field: 'descricao_produto'
  },
  industrializado: {
    type: DataTypes.BOOLEAN,
    field: 'industrializado'
  },
  id_subdepartamento: {
    type: DataTypes.INTEGER,
    field: 'id_subdepartamento'
  },
  nome_subdepartamento: {
    type: DataTypes.STRING,
    field: 'nome_subdepartamento'
  },
  ativo_subdepartamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativo_subdepartamento'
  },
  pesavel_status: {
    type: DataTypes.BOOLEAN,
    field: 'pesavel_status'
  },
  pesavel_fracao: {
    type: DataTypes.DECIMAL,
    field: 'pesavel_fracao'
  },
  pesavel_tipo: {
    type: DataTypes.STRING,
    field: 'pesavel_tipo'
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    field: 'destaque'
  },
  qtde_estoque_minimo: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_minimo'
  },
  qtde_estoque_atual: {
    type: DataTypes.DECIMAL,
    field: 'qtde_estoque_atual'
  },
  percentual_limite_venda: {
    type: DataTypes.DECIMAL,
    field: 'percentual_limite_venda'
  },
  qtde_limite_venda: {
    type: DataTypes.DECIMAL,
    field: 'qtde_limite_venda'
  },
};