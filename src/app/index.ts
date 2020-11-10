import { promises as fs } from 'fs';
const path = require('path');
import { get } from 'lodash';
const { Sequelize } = require('sequelize');
import { errorLog, log } from './inc/lib';
import {
  buscaProdutosDB,
  processaProdutosLoja
} from './inc/produtos';
import {
  buscaFormasDB,
  processaFormasLoja
} from './inc/formas-pgto';
import {
  buscaEstoqueDB,
  processaEstoqueLoja
} from './inc/estoque';
import {
  ESTOQUE_REQ_FIELDS,
  FORMAS_REQ_FIELDS,
  PRODUTOS_REQ_FIELDS
} from './consts';

// config
import { CONFIG } from './config/config';
import { CONFIG_FORMAS } from './config/origens/config-formas-pgto';
import { CONFIG_MERCADEIRO } from './config/projetos/config-mercadeiro';
import { CONFIG_PRODUTOS } from './config/origens/config-produtos';
import { CONFIG_ESTOQUE } from './config/origens/config-estoque';

(async function main() {
  try {
    let sequelize;

    // const ARGS: string[] = yargs.argv._;
    // const PATH: string = (ARGS[0] || '').trim();
    const SEARCH_REG_EXP = /"/g;

    // const PATH: string = path.dirname(require.main.filename);
    const PROJETOS = {
      mercadeiro: (get(CONFIG_MERCADEIRO, 'lojas') || []).length
    };

    let resultado = {
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
      formas: {
        total: 0,
        sincronizados: 0
      },
      estoque: {
        total: 0,
        sincronizados: 0
      },
    };

    log(`Verificando configurações de lojas em integrações: ${JSON.stringify(PROJETOS)}`);
    if (
      !PROJETOS.mercadeiro
      // && !PROJETOS.supermercadeiro
      // && !PROJETOS.bairristas
      // && !PROJETOS.pedeon
    ) {
      throw new Error('Nenhuma loja indicada em projetos: config/projetos/config-*.ts');
    } // if

    log('Verificando configurações de pasta csv.');
    const PASTA_CSV: string = get(CONFIG, 'csv.path') || '';
    if ( // Alguma integração com csv?
      CONFIG_PRODUTOS.tipo.toLowerCase() === 'csv'
      || CONFIG_FORMAS.tipo.toLowerCase() === 'csv'
      || CONFIG_ESTOQUE.tipo.toLowerCase() === 'csv'
    ) {
      if (PASTA_CSV) {
        log('Encontrado: ' + PASTA_CSV);
      } else {
        throw new Error('Nenhuma pasta csv indicada: config/config.ts: csv.path');
      } // else
    } else {
      log('Nenhuma integração csv encontrada');
    } // else

    log('Verificando configurações de conexão com banco de dados.');
    if ( // Alguma conexão com db?
      CONFIG_PRODUTOS.tipo.toLowerCase() === 'db'
      || CONFIG_FORMAS.tipo.toLowerCase() === 'db'
      || CONFIG_ESTOQUE.tipo.toLowerCase() === 'db'
    ) {
      // Erros de conexão com DB?
      if (
        !CONFIG.db.conexao.tipo
        || !CONFIG.db.conexao.host
        || !CONFIG.db.conexao.tabela
        || !CONFIG.db.conexao.usuario
        || !CONFIG.db.conexao.senha
      ) {
        throw new Error('Configurações de conexão insuficientes em: config/config.ts: db.conexao');
      } else {
        // Sequelize
        sequelize = new Sequelize(
          CONFIG.db.conexao.tabela,
          CONFIG.db.conexao.usuario,
          CONFIG.db.conexao.senha,
          {
            host: CONFIG.db.conexao.host,
            dialect: CONFIG.db.conexao.tipo,
          }
        );

        try {
          await sequelize.authenticate();
          log('Conexão com banco de dados estabelecida com sucesso.');
        } catch (error) {
          throw new Error(`Falha de conexão com banco de dados: ${error.message}`);
        } // try-catch
      } // else
    } else {
      log('OBS: Nenhuma integração com banco de dados indicada.');
    } // else

    /* PRODUTOS */
    const TIPO_PRODUTOS: string = (get(CONFIG_PRODUTOS, 'tipo') || '').toLowerCase();
    // console.log(TIPO_PRODUTOS);
    log('Verificando integração PRODUTOS.');
    if (TIPO_PRODUTOS) {
      const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

      switch (TIPO_PRODUTOS) {
        case 'db':
          const VIEW_PRODUTOS: string = get(CONFIG_PRODUTOS, 'nomeView') || '';
          log('Encontrado: ' + VIEW_PRODUTOS);
          // console.log(CAMPOS_PRODUTOS);
          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            try {
              const PRODUTOS = (await buscaProdutosDB(
                sequelize,
                ID_LOJA
              ))
                .map(p => get(p, 'dataValues') || {});

              resultado = {
                ...resultado,
                ...await processaProdutosLoja(
                  ID_LOJA,
                  PRODUTOS
                )
              };
            } catch (error) {
              errorLog(`Loja ${ID_LOJA}: ${error.message}`);
            } // try-catch
          } // for
          break;

        case 'csv':
          // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            const CSV_PATH: string = `${PASTA_CSV}\\produtos\\${ID_LOJA}.csv`;
            const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
            const FIELDPOS = {
              idProduto: -1,
              idDepartamento: -1,
              idSubdepartamento: -1,
              atacadoQtde: -1,
              atacadoValor: -1,
              ativoDepartamento: -1,
              ativoSubdepartamento: -1,
              barcodeProduto: -1,
              descricaoProduto: -1,
              estoqueControlado: -1,
              industrializado: -1,
              nomeDepartamento: -1,
              nomeProduto: -1,
              nomeSubdepartamento: -1,
              percentualLimiteVenda: -1,
              pesavelFracao: -1,
              pesavelStatus: -1,
              pesavelTipo: -1,
              precoVenda: -1,
              produtoAtivo: -1,
              qtdeEstoqueAtual: -1,
              qtdeEstoqueMinimo: -1,
              qtdeLimiteVenda: -1,
              destaque: -1,
            };
            if (EXTENSION !== '.csv') {
              errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/produtos/{idLoja}.csv');
              break;
            } // if
            log(`Lendo ${CSV_PATH}`);
            try {
              const VALUE = await fs.readFile(CSV_PATH, 'utf8');
              // console.log(VALUE);
              if (VALUE.trim()) {
                log('Removendo linhas vazias ou comentadas.');
                // Separa linhas e remove vazias ou comentadas.
                let rows: string[] = VALUE.split("\n");
                rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                const LR: number = rows.length;
                resultado.produtos.total = LR - 1; // Ignora cabeçalho.
                log(`${resultado.produtos.total} produto(s) encontrado(s).`);
                // qtde.total = LR - 1;

                const HEADER: string[] = rows[0].split(';');
                // console.log(HEADER);

                log('Validando campos obrigatórios.');
                // Verifica presença de campos requeridos e guarda suas posições.
                let req: string[] = PRODUTOS_REQ_FIELDS;
                const LH: number = HEADER.length;
                for (let i = 0; i < LH; i++) {
                  const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                  // console.log(FIELD);
                  // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                  req = req.filter(v => {
                    return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                  });
                  if (FIELD) {
                    FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                  } // if
                } // for
                // console.log(req);
                // console.log(FIELDPOS);

                if (req.length) {
                  throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                } // if

                log('Verificando largura das linhas.');
                // Verifica se todas linhas batem com header
                const BADLINES: number[] = [];
                // console.log(LH);
                for (let i = 0; i < LR; i++) {
                  const ROW: string[] = rows[i].split(';');
                  // console.log(`${i} ${ROW.length}/${LH}`);
                  // console.log("\n");
                  // console.log(ROW);
                  if (ROW.length !== LH) {
                    BADLINES.push(i);
                  } else {
                    /* if (!(
                        ROW[FIELDPOS['seu_codigo']].trim().length
                        && ROW[FIELDPOS['barcode']].trim().length
                        && ROW[FIELDPOS['nome']].trim().length
                        && ROW[FIELDPOS['preco']].trim().length
                        && ROW[FIELDPOS['id_departamento']].trim().length
                    )) {
                        BADLINES.push(i);
                    } // if */
                  } // if
                } // for
                // console.log(BADLINES);

                if (BADLINES.length) {
                  throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                } // if

                log('Convertendo linhas texto para produtos.');
                const PRODUTOS = [];
                for (let i = 0; i < LR; i++) {
                  if (i) { // ignora header
                    const ROW: string[] = rows[i]
                      .replace(SEARCH_REG_EXP, '')
                      .replace("\r", '')
                      .split(';')
                      .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                    // console.log(ROW);
                    const ID_SUBDEPARTAMENTO: string = `${ROW[FIELDPOS['idSubdepartamento']]}`.trim();
                    const PRODUTO = {
                      'idProduto': FIELDPOS['idProduto'] >= 0
                        && `${ROW[FIELDPOS['idProduto']].trim()}`,

                      'barcodeProduto': FIELDPOS['barcodeProduto'] >= 0
                        && `${ROW[FIELDPOS['barcodeProduto']].trim()}`,

                      'nomeProduto': FIELDPOS['nomeProduto'] >= 0
                        && `${ROW[FIELDPOS['nomeProduto']].trim()}`,

                      'precoVenda': FIELDPOS['precoVenda'] >= 0
                        && parseFloat(ROW[FIELDPOS['precoVenda']] || ''),

                      'idDepartamento': FIELDPOS['idDepartamento'] >= 0
                        && `${ROW[FIELDPOS['idDepartamento']].trim()}`,

                      'nomeDepartamento': FIELDPOS['nomeDepartamento'] >= 0
                        && `${ROW[FIELDPOS['nomeDepartamento']].trim()}`,

                      'ativoDepartamento': FIELDPOS['ativoDepartamento'] >= 0
                        && parseInt(ROW[FIELDPOS['ativoDepartamento']] || '') > 0,

                      'atacadoQtde': FIELDPOS['atacadoQtde'] >= 0
                        && parseFloat(ROW[FIELDPOS['atacadoQtde']] || ''),

                      'atacadoValor': FIELDPOS['atacadoValor'] >= 0
                        && parseFloat(ROW[FIELDPOS['atacadoValor']] || ''),

                      'industrializado': FIELDPOS['industrializado'] >= 0
                        && parseInt(ROW[FIELDPOS['industrializado']] || '') > 0,

                      'idSubdepartamento': FIELDPOS['idSubdepartamento'] >= 0
                        && (ID_SUBDEPARTAMENTO === '0' ? '' : ID_SUBDEPARTAMENTO)
                        || '',

                      'nomeSubdepartamento': FIELDPOS['nomeSubdepartamento'] >= 0
                        && `${ROW[FIELDPOS['nomeSubdepartamento']].trim()}`,

                      'ativoSubdepartamento': FIELDPOS['ativoSubdepartamento'] >= 0
                        && parseInt(ROW[FIELDPOS['ativoSubdepartamento']] || '') > 0,

                      'produtoAtivo': FIELDPOS['produtoAtivo'] >= 0
                        && parseInt(ROW[FIELDPOS['produtoAtivo']] || '') > 0,

                      'pesavelStatus': FIELDPOS['pesavelStatus'] >= 0
                        && parseInt(ROW[FIELDPOS['pesavelStatus']] || '') > 0,

                      'percentualLimiteVenda': FIELDPOS['percentualLimiteVenda'] >= 0
                        && parseFloat(ROW[FIELDPOS['percentualLimiteVenda']] || ''),

                      'pesavelFracao': FIELDPOS['pesavelFracao'] >= 0
                        && parseFloat(ROW[FIELDPOS['pesavelFracao']] || ''),

                      'pesavelTipo': FIELDPOS['pesavelTipo'] >= 0
                        && `${ROW[FIELDPOS['pesavelTipo']].trim()}`,

                      'descricaoProduto': FIELDPOS['descricaoProduto'] >= 0
                        && `${ROW[FIELDPOS['descricaoProduto']].trim()}`,

                      'destaque': FIELDPOS['destaque'] >= 0
                        && parseInt(ROW[FIELDPOS['destaque']] || '') > 0,

                      'qtdeEstoqueMinimo': FIELDPOS['qtdeEstoqueMinimo'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtdeEstoqueMinimo']] || ''),

                      'qtdeEstoqueAtual': FIELDPOS['qtdeEstoqueAtual'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtdeEstoqueAtual']] || ''),

                      'qtdeLimiteVenda': FIELDPOS['qtdeLimiteVenda'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtdeLimiteVenda']] || ''),

                      'estoqueControlado': FIELDPOS['estoqueControlado'] >= 0
                        && parseInt(ROW[FIELDPOS['estoqueControlado']] || '') > 0,
                    };
                    PRODUTOS.push(PRODUTO);
                  } // if
                } // for
                // console.log(PRODUTOS);
                resultado = {
                  ...resultado,
                  ...await processaProdutosLoja(
                    ID_LOJA,
                    PRODUTOS
                  )
                };
              } else {
                log('OBS: Arquivo .csv vazio.');
              } // else
            } catch (error) {
              errorLog(error.message);
            } // try-catch
          } // for
          break;


        default:
          errorLog('Tipo de origem inválido: config/origens/config-produtos.ts: tipo');
          break;
      } // switch

      log(JSON.stringify({
        departamentos: resultado.departamentos,
        subdepartamentos: resultado.subdepartamentos,
        produtos: resultado.produtos,
      }));
    } // if

    /* FORMAS PGTO */
    const TIPO_FORMAS: string = (get(CONFIG_FORMAS, 'tipo') || '').toLowerCase();
    log('Verificando integração FORMAS PGTO.');
    if (TIPO_FORMAS) {
      const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

      // console.log(TIPO_FORMAS);
      switch (TIPO_FORMAS) {
        case 'db':
          const VIEW_FORMAS: string = get(CONFIG_FORMAS, 'nomeView') || '';
          log('Encontrado: ' + VIEW_FORMAS);

          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            try {
              const FORMAS = (await buscaFormasDB(
                sequelize,
                ID_LOJA
              ))
                .map(p => get(p, 'dataValues') || {});

              resultado = {
                ...resultado,
                ...await processaFormasLoja(
                  ID_LOJA,
                  FORMAS
                )
              };
            } catch (error) {
              errorLog(`Loja ${ID_LOJA}: ${error.message}`);
            } // try-catch
          } // for
          break;

        case 'csv':
          // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            const CSV_PATH: string = `${PASTA_CSV}\\formas-pgto\\${ID_LOJA}.csv`;
            const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
            const FIELDPOS = {
              idInterno: -1,
              formaAtiva: -1,
              nomeForma: -1,
              idExterno: -1
            };
            if (EXTENSION !== '.csv') {
              errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/formas-pgto/{idLoja}.csv');
              break;
            } // if
            log(`Lendo ${CSV_PATH}`);
            try {
              const VALUE = await fs.readFile(CSV_PATH, 'utf8');
              // console.log(VALUE);
              if (VALUE.trim()) {
                log('Removendo linhas vazias ou comentadas.');
                // Separa linhas e remove vazias ou comentadas.
                let rows: string[] = VALUE.split("\n");
                rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                const LR: number = rows.length;
                resultado.formas.total = LR - 1; // Ignora cabeçalho.
                log(`${resultado.formas.total} forma(s) pgto encontrada(s).`);
                // qtde.total = LR - 1;

                const HEADER: string[] = rows[0].split(';');
                // console.log(HEADER);

                log('Validando campos obrigatórios.');
                // Verifica presença de campos requeridos e guarda suas posições.
                let req: string[] = FORMAS_REQ_FIELDS;
                const LH: number = HEADER.length;
                for (let i = 0; i < LH; i++) {
                  const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                  // console.log(FIELD);
                  // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                  req = req.filter(v => {
                    return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                  });
                  if (FIELD) {
                    FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                  } // if
                } // for
                // console.log(req);
                // console.log(FIELDPOS);

                if (req.length) {
                  throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                } // if

                log('Verificando largura das linhas.');
                // Verifica se todas linhas batem com header
                const BADLINES: number[] = [];
                // console.log(LH);
                for (let i = 0; i < LR; i++) {
                  const ROW: string[] = rows[i].split(';');
                  // console.log(`${i} ${ROW.length}/${LH}`);
                  // console.log("\n");
                  // console.log(ROW);
                  if (ROW.length !== LH) {
                    BADLINES.push(i);
                  } else {
                    /* if (!(
                        ROW[FIELDPOS['seu_codigo']].trim().length
                        && ROW[FIELDPOS['barcode']].trim().length
                        && ROW[FIELDPOS['nome']].trim().length
                        && ROW[FIELDPOS['preco']].trim().length
                        && ROW[FIELDPOS['id_departamento']].trim().length
                    )) {
                        BADLINES.push(i);
                    } // if */
                  } // if
                } // for
                // console.log(BADLINES);

                if (BADLINES.length) {
                  throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                } // if

                log('Convertendo linhas texto para formas pgto.');
                const FORMAS = [];
                for (let i = 0; i < LR; i++) {
                  if (i) { // ignora header
                    const ROW: string[] = rows[i]
                      .replace(SEARCH_REG_EXP, '')
                      .replace("\r", '')
                      .split(';')
                      .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                    // console.log(ROW);
                    const FORMA = {
                      'idInterno': FIELDPOS['idInterno'] >= 0
                        && `${ROW[FIELDPOS['idInterno']].trim()}`,

                      'formaAtiva': FIELDPOS['formaAtiva'] >= 0
                        && parseInt(ROW[FIELDPOS['formaAtiva']] || '') > 0,

                      'nomeForma': FIELDPOS['nomeForma'] >= 0
                        && `${ROW[FIELDPOS['nomeForma']].trim()}`,

                      'idExterno': FIELDPOS['idExterno'] >= 0
                        && `${ROW[FIELDPOS['idExterno']].trim()}`,
                    };
                    FORMAS.push(FORMA);
                  } // if
                } // for
                // console.log(FORMAS);
                resultado = {
                  ...resultado,
                  ...await processaFormasLoja(
                    ID_LOJA,
                    FORMAS
                  )
                };
              } else {
                log('OBS: Arquivo .csv vazio.');
              } // else
            } catch (error) {
              errorLog(error.message);
            } // try-catch
          } // for
          break;

        default:
          errorLog('Tipo de origem inválido: config/origens/config-formas-pgto.ts: tipo');
          break;
      } // switch

      log(JSON.stringify({
        formas: resultado.formas
      }));
    } // if

    /* ESTOQUE */
    let tipoEstoque: string = (get(CONFIG_ESTOQUE, 'tipo') || '').toLowerCase();
    // console.log(tipoEstoque);

    if (TIPO_PRODUTOS) {
      log('INTEGRAÇÃO DE PRODUTOS ENCONTRADA. IGNORANDO INTEGRAÇÃO DE ESTOQUE: config/origens/config-estoque.ts: tipo');
      tipoEstoque = '';
    } // if

    log('Verificando integração ESTOQUE.');
    if (tipoEstoque) {
      const LOJAS_MERCADEIRO: any[] = get(CONFIG_MERCADEIRO, 'lojas') || [];

      switch (tipoEstoque) {
        case 'db':
          const VIEW_FORMAS: string = get(CONFIG_FORMAS, 'nomeView') || '';
          log('Encontrado: ' + VIEW_FORMAS);
          // console.log(CAMPOS_ESTOQUE);

          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            try {
              const ESTOQUE = (await buscaEstoqueDB(
                sequelize,
                ID_LOJA
              ))
                .map(p => get(p, 'dataValues') || {});

              resultado = {
                ...resultado,
                ...await processaEstoqueLoja(
                  ID_LOJA,
                  ESTOQUE
                )
              };
            } catch (error) {
              errorLog(`Loja ${ID_LOJA}: ${error.message}`);
            } // try-catch
          } // for
          break;

        case 'csv':
          // const SOURCE: string = `${PATH}\\assets\\${ORIGEM_PRODUTOS}.csv`;
          for (const LOJA of LOJAS_MERCADEIRO) {
            // console.log(LOJA);
            const ID_LOJA: string = `${get(LOJA, 'id') || ''}`;

            const CSV_PATH: string = `${PASTA_CSV}\\estoque\\${ID_LOJA}.csv`;
            const EXTENSION: string = path.extname(CSV_PATH).toLowerCase();
            const FIELDPOS = {
              idProduto: -1,
              barcodeProduto: -1,
              nomeProduto: -1,
              qtdeEstoqueAtual: -1,
              qtdeEstoqueMinimo: -1
            };
            if (EXTENSION !== '.csv') {
              errorLog('Formato inválido. Apenas arquivos .csv são aceitos: config/config.ts: csv.path/estoque/{idLoja}.csv');
              break;
            } // if
            log(`Lendo ${CSV_PATH}`);
            try {
              const VALUE = await fs.readFile(CSV_PATH, 'utf8');
              // console.log(VALUE);
              if (VALUE.trim()) {
                log('Removendo linhas vazias ou comentadas.');
                // Separa linhas e remove vazias ou comentadas.
                let rows: string[] = VALUE.split("\n");
                rows = rows.filter(r => r.trim() && r && r[0] !== '*');
                const LR: number = rows.length;
                resultado.estoque.total = LR - 1; // Ignora cabeçalho.
                log(`${resultado.estoque.total} produto(s) estoque controlado encontrado(s).`);
                // qtde.total = LR - 1;

                const HEADER: string[] = rows[0].split(';');
                // console.log(HEADER);

                log('Validando campos obrigatórios.');
                // Verifica presença de campos requeridos e guarda suas posições.
                let req: string[] = ESTOQUE_REQ_FIELDS;
                const LH: number = HEADER.length;
                for (let i = 0; i < LH; i++) {
                  const FIELD: string = HEADER[i].trim().replace(SEARCH_REG_EXP, '');
                  // console.log(FIELD);
                  // i === 1 && console.log(v.trim().toLowerCase().replace(SEARCH_REG_EXP, ''), FIELD);
                  req = req.filter(v => {
                    return v.trim().toLowerCase().replace(SEARCH_REG_EXP, '') !== FIELD.toLowerCase();
                  });
                  if (FIELD) {
                    FIELDPOS[FIELD] = i; // Guarda posição da coluna.
                  } // if
                } // for
                // console.log(req);
                // console.log(FIELDPOS);

                if (req.length) {
                  throw new Error(`Campos obrigatórios não indicados: ${req.join(', ')}`);
                } // if

                log('Verificando largura das linhas.');
                // Verifica se todas linhas batem com header
                const BADLINES: number[] = [];
                // console.log(LH);
                for (let i = 0; i < LR; i++) {
                  const ROW: string[] = rows[i].split(';');
                  // console.log(`${i} ${ROW.length}/${LH}`);
                  // console.log("\n");
                  // console.log(ROW);
                  if (ROW.length !== LH) {
                    BADLINES.push(i);
                  } else {
                    /* if (!(
                        ROW[FIELDPOS['seu_codigo']].trim().length
                        && ROW[FIELDPOS['barcode']].trim().length
                        && ROW[FIELDPOS['nome']].trim().length
                        && ROW[FIELDPOS['preco']].trim().length
                        && ROW[FIELDPOS['id_departamento']].trim().length
                    )) {
                        BADLINES.push(i);
                    } // if */
                  } // if
                } // for
                // console.log(BADLINES);

                if (BADLINES.length) {
                  throw new Error(`Linhas inválidas encontradas: ${BADLINES.join(', ')}`);
                } // if

                log('Convertendo linhas texto para produtos estoque controlado.');
                const ESTOQUE = [];
                for (let i = 0; i < LR; i++) {
                  if (i) { // ignora header
                    const ROW: string[] = rows[i]
                      .replace(SEARCH_REG_EXP, '')
                      .replace("\r", '')
                      .split(';')
                      .map((r: string) => r.toLowerCase() === 'null' ? '' : r.trim());
                    // console.log(ROW);
                    const PRODUTO = {
                      'idProduto': FIELDPOS['idProduto'] >= 0
                        && `${ROW[FIELDPOS['idProduto']].trim()}`,

                      'barcodeProduto': FIELDPOS['barcodeProduto'] >= 0
                        && `${ROW[FIELDPOS['barcodeProduto']].trim()}`,

                      'nomeProduto': FIELDPOS['nomeProduto'] >= 0
                        && `${ROW[FIELDPOS['nomeProduto']].trim()}`,

                      'qtdeEstoqueMinimo': FIELDPOS['qtdeEstoqueMinimo'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtdeEstoqueMinimo']] || ''),

                      'qtdeEstoqueAtual': FIELDPOS['qtdeEstoqueAtual'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtdeEstoqueAtual']] || '')
                    };
                    ESTOQUE.push(PRODUTO);
                  } // if
                } // for
                // console.log(ESTOQUE);
                resultado = {
                  ...resultado,
                  ...await processaEstoqueLoja(
                    ID_LOJA,
                    ESTOQUE
                  )
                };
              } else {
                log('OBS: Arquivo .csv vazio.');
              } // else
            } catch (error) {
              errorLog(error.message);
            } // try-catch
          } // for
          break;

        default:
          errorLog('Tipo de origem inválido: config/origens/config-estoque.ts: tipo');
          break;
      } // switch

      log(JSON.stringify({
        estoque: resultado.estoque
      }));
    } // if

    log(JSON.stringify(resultado));
  } catch (error) {
    errorLog(error.message);
  } // try-catch
})();