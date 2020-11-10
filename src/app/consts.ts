const { DataTypes } = require('sequelize');

// CSVs
export const PRODUTOS_REQ_FIELDS: string[] = [
  'idProduto', // STRING
  'idDepartamento', // STRING
  'idSubdepartamento', // STRING
  'atacadoQtde', // INTEGER
  'atacadoValor', // INTEGER/FLOAT
  'ativoDepartamento', // BOOLEAN
  'ativoSubdepartamento', // BOOLEAN
  'barcodeProduto', // STRING
  'descricaoProduto', // STRING
  'estoqueControlado', // BOOLEAN
  'industrializado', // BOOLEAN
  'nomeDepartamento', // STRING
  'nomeProduto', // STRING
  'nomeSubdepartamento', // STRING
  'percentualLimiteVenda', // INTEGER/FLOAT
  'pesavelFracao', // FLOAT
  'pesavelStatus', // BOOLEAN
  'pesavelTipo', // STRING
  'precoVenda', // FLOAT
  'produtoAtivo', // BOOLEAN
  'qtdeEstoqueAtual', // INTEGER/FLOAT
  'qtdeEstoqueMinimo', // INTEGER/FLOAT
  'qtdeLimiteVenda', // INTEGER/FLOAT
  'destaque', // BOOLEAN
];

export const FORMAS_REQ_FIELDS: string[] = [
  'idInterno', // STRING
  'formaAtiva', // BOOLEAN
  'nomeForma', // STRING
  'idExterno', // STRING
];

export const ESTOQUE_REQ_FIELDS: string[] = [
  'idProduto', // STRING
  'barcodeProduto', // STRING
  'nomeProduto', // STRING
  'qtdeEstoqueAtual', // INTEGER/FLOAT
  'qtdeEstoqueMinimo', // INTEGER/FLOAT
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
  idProduto: {
    type: DataTypes.STRING,
    field: 'idProduto',
    primaryKey: true
  },
  estoqueControlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoqueControlado'
  },
  barcodeProduto: {
    type: DataTypes.STRING,
    field: 'barcodeProduto'
  },
  nomeProduto: {
    type: DataTypes.STRING,
    field: 'nomeProduto'
  },
  idLoja: {
    type: DataTypes.STRING,
    field: 'idLoja'
  },
  qtdeEstoqueMinimo: {
    type: DataTypes.DECIMAL,
    field: 'qtdeEstoqueMinimo'
  },
  qtdeEstoqueAtual: {
    type: DataTypes.DECIMAL,
    field: 'qtdeEstoqueAtual'
  },
};

// formas pgto
export const CAMPOS_FORMAS: any = {
  idInterno: {
    type: DataTypes.STRING,
    field: 'idInterno',
    primaryKey: true
  },
  idExterno: {
    type: DataTypes.STRING,
    field: 'idExterno'
  },
  nomeForma: {
    type: DataTypes.STRING,
    field: 'nomeForma'
  },
  idLoja: {
    type: DataTypes.STRING,
    field: 'idLoja'
  }
};

// produtos
export const CAMPOS_PRODUTOS: any = {
  idProduto: {
    type: DataTypes.STRING,
    field: 'idProduto',
    primaryKey: true
  },
  idLoja: {
    type: DataTypes.STRING,
    field: 'idLoja'
  },
  estoqueControlado: {
    type: DataTypes.BOOLEAN,
    field: 'estoqueControlado'
  },
  barcodeProduto: {
    type: DataTypes.STRING,
    field: 'barcodeProduto'
  },
  idDepartamento: {
    type: DataTypes.STRING,
    field: 'idDepartamento'
  },
  nomeDepartamento: {
    type: DataTypes.STRING,
    field: 'nomeDepartamento'
  },
  ativoDepartamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativoDepartamento'
  },
  nomeProduto: {
    type: DataTypes.STRING,
    field: 'nomeProduto'
  },
  precoVenda: {
    type: DataTypes.DECIMAL,
    field: 'precoVenda'
  },
  produtoAtivo: {
    type: DataTypes.BOOLEAN,
    field: 'produtoAtivo'
  },
  atacadoQtde: {
    type: DataTypes.INTEGER,
    field: 'atacadoQtde'
  },
  atacadoValor: {
    type: DataTypes.DECIMAL,
    field: 'atacadoValor'
  },
  descricaoProduto: {
    type: DataTypes.STRING,
    field: 'descricaoProduto'
  },
  industrializado: {
    type: DataTypes.BOOLEAN,
    field: 'industrializado'
  },
  idSubdepartamento: {
    type: DataTypes.STRING,
    field: 'idSubdepartamento'
  },
  nomeSubdepartamento: {
    type: DataTypes.STRING,
    field: 'nomeSubdepartamento'
  },
  ativoSubdepartamento: {
    type: DataTypes.BOOLEAN,
    field: 'ativoSubdepartamento'
  },
  pesavelStatus: {
    type: DataTypes.BOOLEAN,
    field: 'pesavelStatus'
  },
  pesavelFracao: {
    type: DataTypes.DECIMAL,
    field: 'pesavelFracao'
  },
  pesavelTipo: {
    type: DataTypes.STRING,
    field: 'pesavelTipo'
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    field: 'destaque'
  },
  qtdeEstoqueMinimo: {
    type: DataTypes.DECIMAL,
    field: 'qtdeEstoqueMinimo'
  },
  qtdeEstoqueAtual: {
    type: DataTypes.DECIMAL,
    field: 'qtdeEstoqueAtual'
  },
  percentualLimiteVenda: {
    type: DataTypes.DECIMAL,
    field: 'percentualLimiteVenda'
  },
  qtdeLimiteVenda: {
    type: DataTypes.DECIMAL,
    field: 'qtdeLimiteVenda'
  },
};