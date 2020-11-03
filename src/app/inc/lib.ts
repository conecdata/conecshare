import { promises as fs } from 'fs';
import moment from 'moment';
import { CONFIG } from '../config/config';

export function log(msg: string) {
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');
  msg = `${TS} ${msg}`;

  fs.writeFile('ok.log', `${msg}\n`, {
    flag: 'a'
  });
  CONFIG.verbose && console.log(' ' + msg);
}

export function errorLog(msg: string) {
  const TS = moment().format('YYYY-MM-DD HH:mm:ss');

  fs.writeFile('errors.log', `${TS} ${msg}\n`, {
    flag: 'a'
  });
  CONFIG.verbose && console.log('\x1b[31m', `${TS} ERRO: ${msg}`, '\x1b[0m');
}
