import * as rp from 'request-promise';
import { errorLog, log } from './lib';
import {
  API_URL,
  CAMPOS_FORMAS
} from '../consts';
import { CONFIG } from '../config/config';
import {
  get,
  uniqBy
} from 'lodash';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { CONFIG_FORMAS } from '../config/origens/config-formas-pgto';
var hash = require('object-hash');
var Datastore = require('nedb');

export async function processaFormasLoja(
  idLoja: string,
  formas: any[]
) {
  const RESULTADO = {
    formas: {
      total: 0,
      sincronizados: 0
    }
  };

  try {
    RESULTADO.formas.total = formas.length;
    log(`${RESULTADO.formas.total} formas(s) pgto encontrada(s).`);
    // console.log(formas);
    RESULTADO.formas.sincronizados = await syncFormas(
      idLoja,
      formas
    );

    return RESULTADO;
  } catch (error) {
    return Promise.reject(error);
  } // try-catch
}

export async function buscaFormasDB(
  sequelize,
  idLoja: string
) {
  if (sequelize) {
    try {
      log('Buscando formas pgto do DB.');
      await sequelize.sync();

      const Forma = sequelize.define('Forma',
        CAMPOS_FORMAS,
        {
          timestamps: false,
          sequelize,
          modelName: 'Forma',
          tableName: get(CONFIG_FORMAS, 'nomeView') || ''
        }
      );

      // console.log('findall');
      return Forma.findAll(
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

export async function syncFormas(
  idLoja: string,
  formas: any[]
): Promise<number> {
  let count: number = 0;

  if (
    idLoja
    && formas.length
  ) {
    // NeDB
    var NeDB_formas = new Datastore(
      {
        filename: `lojas/${idLoja}/formas-pgto.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando formas pgto.');
    for (let i = 0; i < formas.length; i++) {
      // console.log("\n");
      // console.log(formas[i].dataValues);

      const FORMA = formas[i] || {};
      // console.log(FORMA);
      const ID_FORMA: string = get(FORMA, 'idInterno') || '';

      try {
        count += await findOne(
          NeDB_formas,
          idLoja,
          FORMA
        );
      } catch (error) {
        errorLog(`Forma pgto ${ID_FORMA}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

async function apiUpdateForma(
  idForma: string,
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
    const URL: string = `${URL_API}/formas-pgto/${idForma}`;
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
  forma: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    const ID_FORMA: string = get(forma, 'idInterno') || '';
    // console.log(ID_FORMA);
    const BODY_FORMA = {
      "ativo": !!get(forma, 'formaAtiva', true),
      "nossoId": get(forma, 'idExterno') || ''
    };
    // console.log(BODY_FORMA);
    const HASH_FORMA: string = hash(BODY_FORMA);
    // console.log(HASH_FORMA);

    const DOC = {
      _id: ID_FORMA,
      hash: HASH_FORMA
    };

    neDB.findOne(
      { _id: ID_FORMA },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando forma pgto ' + ID_FORMA);
            await apiUpdateForma(
              ID_FORMA,
              BODY_FORMA,
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
            if (doc.hash !== HASH_FORMA) {
              // console.log('Atualizando forma pgto ' + ID_FORMA);
              await apiUpdateForma(
                ID_FORMA,
                BODY_FORMA,
                idLoja
              );
              neDB.remove(
                { _id: ID_FORMA },
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