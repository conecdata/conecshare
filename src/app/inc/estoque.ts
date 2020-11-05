import * as rp from 'request-promise';
import { errorLog, log } from './lib';
import {
  API_URL,
  CAMPOS_ESTOQUE
} from '../consts';
import { CONFIG } from '../config/config';
import { CONFIG_ESTOQUE } from '../config/origens/config-estoque';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { get } from 'lodash';
var Datastore = require('nedb');

export async function processaEstoqueLoja(
  idLoja: string,
  estoque: any[]
) {
  const RESULTADO = {
    estoque: {
      total: 0,
      sincronizados: 0
    }
  };

  try {
    RESULTADO.estoque.total = estoque.length;
    log(`${RESULTADO.estoque.total} produto(s) estoque controlado encontrado(s).`);
    // console.log(estoque);
    RESULTADO.estoque.sincronizados = await syncEstoque(
      idLoja,
      estoque
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaEstoqueDB(
  sequelize,
  idLoja: string
) {
  const ORIGEM_ESTOQUE: string = get(CONFIG_ESTOQUE, 'nomeOrigem') || '';

  if (sequelize) {
    try {
      log('Buscando estoques do DB.');
      await sequelize.sync();

      const Estoque = sequelize.define('Estoque',
        CAMPOS_ESTOQUE,
        {
          timestamps: false,
          sequelize,
          modelName: 'Estoque',
          tableName: ORIGEM_ESTOQUE,
        }
      );

      // console.log('findall');
      return Estoque.findAll(
        {
          where: {
            idLoja: idLoja
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

export async function syncEstoque(
  idLoja: string,
  estoque: any[]
): Promise<number> {
  let count: number = 0;

  if (
    idLoja
    && estoque.length
  ) {
    // NeDB
    var NeDB_estoque = new Datastore(
      {
        filename: `lojas/${idLoja}/estoque.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando estoque.');
    for (let i = 0; i < estoque.length; i++) {
      // console.log("\n");
      // console.log(estoque[i].dataValues);

      const PRODUTO = estoque[i] || {};
      // console.log(PRODUTO);
      const ID_PRODUTO: string = get(PRODUTO, 'idProduto') || '';

      try {
        count += await findOne(
          NeDB_estoque,
          idLoja,
          PRODUTO
        );
      } catch (error) {
        errorLog(`Produto estoque controlado ${ID_PRODUTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdateEstoque(
  idProduto: string,
  body: any,
  idLoja: string
) {
  /* MERCADEIRO */
  const URL_API: string = CONFIG.api.sandbox
    ? API_URL.mercadeiro.sandbox
    : API_URL.mercadeiro.producao;

  let token: string = '';
  const L: any = CONFIG_MERCADEIRO.lojas
    .find((l: any) => l.id.toString() === idLoja);
  if (L) {
    token = get(L, 'token') || '';
  } // if

  if (token) {
    const URL: string = `${URL_API}/produtos/estoque/${idProduto}`;
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
    const ID_PRODUTO: string = get(produto, 'idProduto') || '';
    // console.log(ID_PRODUTO);
    const ESTOQUE = {
      min: parseFloat(get(produto, 'qtdeEstoqueMinimo') || 0),
      atual: parseFloat(get(produto, 'qtdeEstoqueAtual') || 0)
    };
    const BODY = {
      "estoqueMinimo": ESTOQUE.min
        ? ESTOQUE.atual <= ESTOQUE.min
        : false
    };
    // console.log(BODY);

    const DOC = {
      _id: ID_PRODUTO,
      estoqueMinimo: BODY.estoqueMinimo
    };

    neDB.findOne(
      { _id: ID_PRODUTO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando produto ' + ID_PRODUTO);
            await apiUpdateEstoque(
              ID_PRODUTO,
              BODY,
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
            if (doc.estoqueMinimo !== BODY.estoqueMinimo) {
              // console.log('Atualizando produto ' + ID_PRODUTO);
              await apiUpdateEstoque(
                ID_PRODUTO,
                BODY,
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