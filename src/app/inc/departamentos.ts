import * as rp from 'request-promise';
import { errorLog, log } from './lib';
import { get } from 'lodash';
import { CONFIG } from '../config/config';
import { CONFIG_MERCADEIRO } from '../config/projetos/config-mercadeiro';
import { API_URL } from '../consts';
var hash = require('object-hash');
var Datastore = require('nedb');

export async function syncDepartamentos(
    idLoja: string,
    departamentos: any[]
): Promise<number> {
    let count: number = 0;
    console.log('DEPARTAMENTOS:', departamentos);

    if (
        idLoja
        && departamentos.length
    ) {
        // NeDB
        var NeDB_departamentos = new Datastore(
            {
                filename: `lojas/${idLoja}/departamentos.NeDB`,
                autoload: true
            }
        );

        log('Sincronizando departamentos.');
        for (let i = 0; i < departamentos.length; i++) {
            const BODY_DEPARTAMENTO = departamentos[i];
            const ID_DEPARTAMENTO: string = get(BODY_DEPARTAMENTO, '_id');
            console.log('BODY_DEPARTAMENTO: ', BODY_DEPARTAMENTO);
            try {
                count += await findOne(
                    NeDB_departamentos,
                    idLoja,
                    BODY_DEPARTAMENTO
                );
            } catch (error) {
                errorLog(`Departamento ${ID_DEPARTAMENTO}: ${error.message}`);
            } // try-catch
        } // for
    } // if

    return count;
}

function apiUpdateDepartamento(
    idDepartamento: string,
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
        const URL: string = `${URL_API}/departamentos/${idDepartamento}`;
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
        const ID_DEPARTAMENTO: string = get(body, '_id');
        delete body._id;
        const HASH_DEPARTAMENTO: string = hash(body);
        // console.log(body);

        const DOC = {
            _id: ID_DEPARTAMENTO,
            hash: HASH_DEPARTAMENTO
        };
        // console.log(DOC);

        neDB.findOne(
            { _id: ID_DEPARTAMENTO },
            async function (err, doc) {
                // console.log(doc);
                try {
                    if (!doc) {
                        // log('Criando departamento ' + ID_DEPARTAMENTO);
                        await apiUpdateDepartamento(
                            ID_DEPARTAMENTO,
                            body,
                            idLoja
                        );
                        neDB.insert(DOC, (err, newDoc) => {
                            // console.log('newDoc', newDoc);
                            if (err) {
                                return reject(err);
                            } else {
                                return resolve(1);
                            } // else
                        });
                    } else {
                        // console.log(doc);
                        // console.log(get(doc, 'hash') || '', '!==', HASH_DEPARTAMENTO);
                        if ((get(doc, 'hash') || '') !== HASH_DEPARTAMENTO) {
                            // log('Atualizando departamento ' + ID_DEPARTAMENTO);
                            await apiUpdateDepartamento(
                                ID_DEPARTAMENTO,
                                body,
                                idLoja
                            );
                            neDB.remove(
                                { _id: ID_DEPARTAMENTO },
                                { multi: true },
                                function (err, numRemoved) {
                                    // console.log('numRemoved', numRemoved);
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