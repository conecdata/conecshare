import * as rp from 'request-promise';
import { errorLog, log } from './lib';
import { get } from 'lodash';
import { CONFIG } from '../config/config';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { API_URL } from '../consts';
var hash = require('object-hash');
var Datastore = require('nedb');

export async function syncSubdepartamentos(
  idLoja: string,
  subdepartamentos: any[]
) {
  let count: number = 0;

  if (
    idLoja
    && subdepartamentos.length
  ) {
    // NeDB
    var NeDB_subdepartamentos = new Datastore(
      {
        filename: `lojas/${idLoja}/subdepartamentos.NeDB`,
        autoload: true
      }
    );

    log('Sincronizando subdepartamentos.');
    for (let i = 0; i < subdepartamentos.length; i++) {
      const BODY_SUBDEPARTAMENTO = subdepartamentos[i] || {};
      const ID_SUBDEPARTAMENTO: string = get(BODY_SUBDEPARTAMENTO, '_id');

      try {
        count += await findOne(
          NeDB_subdepartamentos,
          idLoja,
          BODY_SUBDEPARTAMENTO
        );
      } catch (error) {
        errorLog(`Subdepartamento ${ID_SUBDEPARTAMENTO}: ${error.message}`);
      } // try-catch
    } // for
  } // if

  return count;
}

function apiUpdateSubdepartamento(
  idDepartamento: string,
  idSubdepartamento: string,
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
    const URL: string = `${URL_API}/departamentos/${idDepartamento}/subdepartamentos/${idSubdepartamento}`;
    // console.log(URL);
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
  body: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    const ID_SUBDEPARTAMENTO: string = get(body, '_id') || '';
    const ID_DEPARTAMENTO: string = get(body, 'idDepartamento') || '';
    delete body._id;
    const HASH_SUBDEPARTAMENTO: string = hash(body) || '';
    // console.log(BODY_SUBDEPARTAMENTO);

    const DOC = {
      _id: ID_SUBDEPARTAMENTO,
      hash: HASH_SUBDEPARTAMENTO
    };
    // console.log(DOC);

    neDB.findOne(
      { _id: ID_SUBDEPARTAMENTO },
      async function (err, doc) {
        try {
          if (!doc) {
            // console.log('Criando subdepartamento ' + ID_SUBDEPARTAMENTO);
            await apiUpdateSubdepartamento(
              ID_DEPARTAMENTO,
              ID_SUBDEPARTAMENTO,
              body,
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
            if (doc.hash !== HASH_SUBDEPARTAMENTO) {
              // console.log('Atualizando subdepartamento ' + ID_SUBDEPARTAMENTO);
              await apiUpdateSubdepartamento(
                ID_DEPARTAMENTO,
                ID_SUBDEPARTAMENTO,
                body,
                idLoja
              );

              neDB.remove(
                { _id: ID_SUBDEPARTAMENTO },
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