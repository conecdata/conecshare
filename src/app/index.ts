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
              id_produto: -1,
              id_departamento: -1,
              id_subdepartamento: -1,
              atacado_qtde: -1,
              atacado_valor: -1,
              ativo_departamento: -1,
              ativo_subdepartamento: -1,
              barcode_produto: -1,
              descricao_produto: -1,
              estoque_controlado: -1,
              industrializado: -1,
              nome_departamento: -1,
              nome_produto: -1,
              nome_subdepartamento: -1,
              percentual_limite_venda: -1,
              pesavel_fracao: -1,
              pesavel_status: -1,
              pesavel_tipo: -1,
              preco_venda: -1,
              produto_ativo: -1,
              qtde_estoque_atual: -1,
              qtde_estoque_minimo: -1,
              qtde_limite_venda: -1,
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
                    const ID_SUBDEPARTAMENTO: string = `${ROW[FIELDPOS['id_subdepartamento']]}`.trim();
                    const PRODUTO = {
                      'id_produto': FIELDPOS['id_produto'] >= 0
                        && `${ROW[FIELDPOS['id_produto']].trim()}`,

                      'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                        && `${ROW[FIELDPOS['barcode_produto']].trim()}`,

                      'nome_produto': FIELDPOS['nome_produto'] >= 0
                        && `${ROW[FIELDPOS['nome_produto']].trim()}`,

                      'preco_venda': FIELDPOS['preco_venda'] >= 0
                        && parseFloat(ROW[FIELDPOS['preco_venda']] || ''),

                      'id_departamento': FIELDPOS['id_departamento'] >= 0
                        && `${ROW[FIELDPOS['id_departamento']].trim()}`,

                      'nome_departamento': FIELDPOS['nome_departamento'] >= 0
                        && `${ROW[FIELDPOS['nome_departamento']].trim()}`,

                      'ativo_departamento': FIELDPOS['ativo_departamento'] >= 0
                        && parseInt(ROW[FIELDPOS['ativo_departamento']] || '') > 0,

                      'atacado_qtde': FIELDPOS['atacado_qtde'] >= 0
                        && parseFloat(ROW[FIELDPOS['atacado_qtde']] || ''),

                      'atacado_valor': FIELDPOS['atacado_valor'] >= 0
                        && parseFloat(ROW[FIELDPOS['atacado_valor']] || ''),

                      'industrializado': FIELDPOS['industrializado'] >= 0
                        && parseInt(ROW[FIELDPOS['industrializado']] || '') > 0,

                      'id_subdepartamento': FIELDPOS['id_subdepartamento'] >= 0
                        && (ID_SUBDEPARTAMENTO === '0' ? '' : ID_SUBDEPARTAMENTO)
                        || '',

                      'nome_subdepartamento': FIELDPOS['nome_subdepartamento'] >= 0
                        && `${ROW[FIELDPOS['nome_subdepartamento']].trim()}`,

                      'ativo_subdepartamento': FIELDPOS['ativo_subdepartamento'] >= 0
                        && parseInt(ROW[FIELDPOS['ativo_subdepartamento']] || '') > 0,

                      'produto_ativo': FIELDPOS['produto_ativo'] >= 0
                        && parseInt(ROW[FIELDPOS['produto_ativo']] || '') > 0,

                      'pesavel_status': FIELDPOS['pesavel_status'] >= 0
                        && parseInt(ROW[FIELDPOS['pesavel_status']] || '') > 0,

                      'percentual_limite_venda': FIELDPOS['percentual_limite_venda'] >= 0
                        && parseFloat(ROW[FIELDPOS['percentual_limite_venda']] || ''),

                      'pesavel_fracao': FIELDPOS['pesavel_fracao'] >= 0
                        && parseFloat(ROW[FIELDPOS['pesavel_fracao']] || ''),

                      'pesavel_tipo': FIELDPOS['pesavel_tipo'] >= 0
                        && `${ROW[FIELDPOS['pesavel_tipo']].trim()}`,

                      'descricao_produto': FIELDPOS['descricao_produto'] >= 0
                        && `${ROW[FIELDPOS['descricao_produto']].trim()}`,

                      'destaque': FIELDPOS['destaque'] >= 0
                        && parseInt(ROW[FIELDPOS['destaque']] || '') > 0,

                      'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtde_estoque_minimo']] || ''),

                      'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtde_estoque_atual']] || ''),

                      'qtde_limite_venda': FIELDPOS['qtde_limite_venda'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtde_limite_venda']] || ''),

                      'estoque_controlado': FIELDPOS['estoque_controlado'] >= 0
                        && parseInt(ROW[FIELDPOS['estoque_controlado']] || '') > 0,
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
              id_interno: -1,
              forma_ativa: -1,
              nome_forma: -1,
              id_externo: -1
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
                      'id_interno': FIELDPOS['id_interno'] >= 0
                        && `${ROW[FIELDPOS['id_interno']].trim()}`,

                      'forma_ativa': FIELDPOS['forma_ativa'] >= 0
                        && parseInt(ROW[FIELDPOS['forma_ativa']] || '') > 0,

                      'nome_forma': FIELDPOS['nome_forma'] >= 0
                        && `${ROW[FIELDPOS['nome_forma']].trim()}`,

                      'id_externo': FIELDPOS['id_externo'] >= 0
                        && `${ROW[FIELDPOS['id_externo']].trim()}`,
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
              id_produto: -1,
              barcode_produto: -1,
              nome_produto: -1,
              qtde_estoque_atual: -1,
              qtde_estoque_minimo: -1
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
                      'id_produto': FIELDPOS['id_produto'] >= 0
                        && `${ROW[FIELDPOS['id_produto']].trim()}`,

                      'barcode_produto': FIELDPOS['barcode_produto'] >= 0
                        && `${ROW[FIELDPOS['barcode_produto']].trim()}`,

                      'nome_produto': FIELDPOS['nome_produto'] >= 0
                        && `${ROW[FIELDPOS['nome_produto']].trim()}`,

                      'qtde_estoque_minimo': FIELDPOS['qtde_estoque_minimo'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtde_estoque_minimo']] || ''),

                      'qtde_estoque_atual': FIELDPOS['qtde_estoque_atual'] >= 0
                        && parseFloat(ROW[FIELDPOS['qtde_estoque_atual']] || '')
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