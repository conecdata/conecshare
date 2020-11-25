import * as rp from 'request-promise';
import {
  chkBool,
  errorLog,
  fixBuffStr,
  log
} from './lib';
import { API_URL, CAMPOS_PRODUTOS } from '../consts';
import { CONFIG_PRODUTOS } from '../config/origens/config-produtos';
import { CONFIG } from '../config/config';
import {
  get,
  uniqBy
} from 'lodash';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { syncDepartamentos } from './departamentos';
import { syncSubdepartamentos } from './subdepartamentos';
var hash = require('object-hash');
var Datastore = require('nedb');
var Firebird = require('node-firebird');

export async function processaProdutosLoja(
  idLoja: string,
  produtos: any[]
) {
  const RESULTADO = {
    produtos: {
      total: 0,
      sincronizados: 0
    },
    departamentos: {
      total: 0,
      sincronizados: 0
    },
    subdepartamentos: {
      total: 0,
      sincronizados: 0
    },
  };

  try {
    // console.log(produtos);
    const {
      departamentos: DEPARTAMENTOS,
      subdepartamentos: SUBDEPARTAMENTOS
    } = buscaDepartamentosSubdepartamentos(produtos);
    console.log(DEPARTAMENTOS);
    // console.log(SUBDEPARTAMENTOS);

    log(`${DEPARTAMENTOS.length} departamento(s) encontrado(s).`);
    RESULTADO.departamentos.total = DEPARTAMENTOS.length || 0;
    RESULTADO.departamentos.sincronizados = await syncDepartamentos(
      idLoja,
      DEPARTAMENTOS
    );

    // console.log(SUBDEPARTAMENTOS);
    log(`${SUBDEPARTAMENTOS.length} subdepartamento(s) encontrado(s).`);
    RESULTADO.subdepartamentos.total = SUBDEPARTAMENTOS.length || 0;
    RESULTADO.subdepartamentos.sincronizados = await syncSubdepartamentos(
      idLoja,
      SUBDEPARTAMENTOS
    );

    RESULTADO.produtos.total = produtos.length;
    log(`${RESULTADO.produtos.total} produto(s) encontrado(s).`);
    // console.log(produtos);
    RESULTADO.produtos.sincronizados = await syncProdutos(
      idLoja,
      produtos
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaProdutosDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando produtos do DB.');
      await sequelize.sync();

      const Produto = sequelize.define('Produto',
        CAMPOS_PRODUTOS,
        {
          timestamps: false,
          sequelize,
          modelName: 'Produto',
          tableName: get(CONFIG_PRODUTOS, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return Produto.findAll(
        {
          where: {
            id_loja: +idLoja
          }
        }
      );
    } catch (error) {
      errorLog(error.message);
      return [];
    } // try-catch
  } else {
    return [];
  } // else
}

export async function buscaProdutosFB(idLoja: string) {
  return new Promise((resolve, reject) => {
    if (Firebird) {
      try {
        Firebird.attach(
          CONFIG.fb.conexao,
          function (err, db) {
            if (err) throw err;
            // console.log(db);
            if (db) {
              const SQL: string = `
                SELECT 
                  * 
                FROM 
                  ${CONFIG_PRODUTOS.nomeView} 
                WHERE
                  id_loja = ${idLoja}
                `;
              // console.log(SQL);
              db.query(SQL,
                function (err, result) {
                  // IMPORTANT: close the connection
                  // console.log(result);
                  result.forEach((row) => {
                    row.ID_PRODUTO = fixBuffStr(row.ID_PRODUTO);
                    row.BARCODE_PRODUTO = fixBuffStr(row.BARCODE_PRODUTO);
                    row.NOME_PRODUTO = fixBuffStr(row.NOME_PRODUTO);
                    row.ID_DEPARTAMENTO = fixBuffStr(row.ID_DEPARTAMENTO);
                    row.NOME_DEPARTAMENTO = fixBuffStr(row.NOME_DEPARTAMENTO);
                    row.ATIVO_DEPARTAMENTO = fixBuffStr(row.ATIVO_DEPARTAMENTO);
                    row.ID_SUBDEPARTAMENTO = fixBuffStr(row.ID_SUBDEPARTAMENTO);
                    row.NOME_SUBDEPARTAMENTO = fixBuffStr(row.NOME_SUBDEPARTAMENTO);
                    row.ATIVO_SUBDEPARTAMENTO = fixBuffStr(row.ATIVO_SUBDEPARTAMENTO);
                    row.INDUSTRIALIZADO = fixBuffStr(row.INDUSTRIALIZADO);
                    row.ESTOQUE_CONTROLADO = fixBuffStr(row.ESTOQUE_CONTROLADO);
                    row.PESAVEL_STATUS = fixBuffStr(row.PESAVEL_STATUS);
                    row.PESAVEL_TIPO = fixBuffStr(row.PESAVEL_TIPO);
                    row.PRODUTO_ATIVO = fixBuffStr(row.PRODUTO_ATIVO);
                    row.DESCRICAO_PRODUTO = fixBuffStr(row.DESCRICAO_PRODUTO);
                    row.DESTAQUE = fixBuffStr(row.DESTAQUE);
                    row.ID_LOJA = fixBuffStr(row.ID_LOJA);
                  });
                  db.detach();
                  resolve(result);
                  return;
                }
              );
            } // if
          });
      } catch (error) {
        errorLog(error.message);
        reject(error);
        return;
      } // try-catch
    } else {
      resolve([]);
      return;
    } // else
  });
}

export function buscaDepartamentosSubdepartamentos(produtos: any[]): {
  departamentos: any[];
  subdepartamentos: any[];
} {
  log('Buscando departamentos e subdepartamentos.');
  const RETORNO = {
    departamentos: [],
    subdepartamentos: []
  };

  for (let i = 0; i < produtos.length; i++) {
    // console.log("\n");
    // console.log(produtos[i].dataValues);

    // Gera lista de departamentos dos produtos.
    RETORNO.departamentos.push({
      _id: `${get(produtos[i], 'id_departamento') || ''}`,
      ativo: chkBool(get(produtos[i], 'ativo_departamento')),
      nome: get(produtos[i], 'nome_departamento') || ''
    });

    // Gera lista de subdepartamentos dos produtos.
    // console.log('idSubdepartamento', get(produtos[i], 'idSubdepartamento') || '');
    if (get(produtos[i], 'id_subdepartamento') || '') {
      RETORNO.subdepartamentos.push({
        _id: `${get(produtos[i], 'id_subdepartamento') || ''}`,
        idDepartamento: `${get(produtos[i], 'id_departamento') || ''}`,
        ativo: chkBool(get(produtos[i], 'ativo_subdepartamento')),
        nome: get(produtos[i], 'nome_subdepartamento') || ''
      });
    } // if
  } // for

  RETORNO.departamentos = uniqBy(RETORNO.departamentos, '_id'); // Elimina repetições
  // console.log(RETORNO.departamentos);
  RETORNO.subdepartamentos = uniqBy(RETORNO.subdepartamentos, '_id'); // Elimina repetições
  // console.log(RETORNO.subdepartamentos);

  return RETORNO;
}

export async function syncProdutos(
  idLoja: string,
  produtos: any[]
): Promise<number> {
  let count: number = 0;

  if (
    idLoja
    && produtos.length
  ) {
    // NeDB
    var NeDB_produtos = new Datastore(
      {
        filename: `lojas/${idLoja}/produtos.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando produtos.');
    for (let i = 0; i < produtos.length; i++) {
      // console.log("\n");
      // console.log(produtos[i].dataValues);

      const PRODUTO = produtos[i] || {};
      // console.log(PRODUTO);
      const ID_PRODUTO: string = get(PRODUTO, 'id_produto') || '';

      try {
        count += await findOne(
          NeDB_produtos,
          idLoja,
          PRODUTO
        );
      } catch (error) {
        errorLog(`Produto ${ID_PRODUTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdateProduto(
  idProduto: string,
  body: any,
  idLoja: string
) {
  /* MERCADEIRO */
  const URL_API: string = CONFIG.sandbox
    ? API_URL.mercadeiro.sandbox
    : API_URL.mercadeiro.producao;

  let token: string = '';
  const L: any = CONFIG_MERCADEIRO.lojas
    .find((l: any) => l.id.toString() === idLoja);
  if (L) {
    token = get(L, 'token') || '';
  } // if

  if (token) {
    const URL: string = `${URL_API}/produtos/${idProduto}`;
    // console.log(URL);
    // console.log(body);
    return rp.post(URL, {
      json: true,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body
    });
  } // if

  // await outputFile(OUTPUT.apiOk, OUTPUT_PATH, rows[i]);
  return Promise.reject(`Token da loja ${idLoja} não encontrado.`);
}

function findOne(
  neDB: any,
  idLoja: string,
  produto: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    // console.log(produto);
    const ID_PRODUTO: string = get(produto, 'id_produto') || '';
    // console.log(ID_PRODUTO);
    const ESTOQUE = {
      controlado: chkBool(get(produto, 'estoque_controlado')),
      min: parseFloat(get(produto, 'qtde_estoque_minimo')) || 0,
      atual: parseFloat(get(produto, 'qtde_estoque_atual')) || 0
    };
    const LIMITE_VENDA = {
      percentual: parseFloat(get(produto, 'percentual_limite_venda')) || 0,
      qtde: parseFloat(get(produto, 'qtde_limite_venda')) || 0,
      menorValor: 0
    };
    const VAL_PERCENTUAL: number = ESTOQUE.atual * (LIMITE_VENDA.percentual / 100);
    LIMITE_VENDA.menorValor = LIMITE_VENDA.qtde > 0
      ? (
        VAL_PERCENTUAL > 0
          ? (
            VAL_PERCENTUAL < LIMITE_VENDA.qtde
              ? VAL_PERCENTUAL
              : LIMITE_VENDA.qtde
          )
          : LIMITE_VENDA.qtde
      )
      : VAL_PERCENTUAL;
    // console.log(produto);
    const BODY_PRODUTO = {
      "atacado": {
        "qtde": parseFloat(get(produto, 'atacado_qtde')) || 0,
        "valor": parseFloat(get(produto, 'atacado_valor')) || 0,
      },
      "ativo": chkBool(get(produto, 'produto_ativo', true)),
      "barcode": get(produto, 'barcode_produto') || '',
      "descricao": get(produto, 'descricao_produto') || '',
      "estoqueMinimo": ESTOQUE.controlado && ESTOQUE.min
        ? ESTOQUE.atual <= ESTOQUE.min
        : false,
      "idDepartamento": get(produto, 'id_departamento') || '',
      "idSubdepartamento": get(produto, 'id_subdepartamento') || '',
      "industrializado": chkBool(get(produto, 'industrializado', true)),
      "limiteVenda": LIMITE_VENDA.menorValor,
      "pesavel": {
        "status": chkBool(get(produto, 'pesavel_status', false)),
        "unidade": {
          "fracao": parseFloat(get(produto, 'pesavel_fracao')) || 0,
          "tipo": get(produto, 'pesavel_tipo') || ''
        }
      },
      "nome": get(produto, 'nome_produto') || '',
      "preco": parseFloat(get(produto, 'preco_venda')) || 0,
      "destaque": chkBool(get(produto, 'destaque', false))
    };
    console.log(BODY_PRODUTO);
    const HASH_PRODUTO: string = hash(BODY_PRODUTO);
    // console.log(HASH_PRODUTO);

    const DOC = {
      _id: ID_PRODUTO,
      hash: HASH_PRODUTO,
      // estoqueMinimo: false
    };

    neDB.findOne(
      { _id: ID_PRODUTO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando produto ' + ID_PRODUTO);
            await apiUpdateProduto(
              ID_PRODUTO,
              BODY_PRODUTO,
              idLoja
            );
            neDB.insert(
              DOC,
              function (err, newDoc) {
                // console.log('newDoc', newDoc);
                if (err) {
                  return reject(err);
                } else {
                  return resolve(1);
                } // else
              }
            );
          } else {
            // console.log(doc);
            if (doc.hash !== HASH_PRODUTO) {
              // console.log('Atualizando produto ' + ID_PRODUTO);
              await apiUpdateProduto(
                ID_PRODUTO,
                BODY_PRODUTO,
                idLoja
              );
              neDB.remove(
                { _id: ID_PRODUTO },
                { multi: true },
                function (err, numRemoved) {
                  // console.log('newDoc', newDoc);
                  if (err) {
                    return reject(err);
                  } else {
                    neDB.insert(
                      DOC,
                      function (err, newDoc) {
                        // console.log('newDoc', newDoc);
                        if (err) {
                          return reject(err);
                        } else {
                          return resolve(1);
                        } // else
                      }
                    );
                  } // else
                });
            } else {
              return resolve(0);
            } // else
          } // else
        } catch (error) {
          return reject(error);
        } // try-catch
      } // function
    );
  });
}