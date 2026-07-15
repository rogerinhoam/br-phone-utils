#!/usr/bin/env node
'use strict';

const {
  formatBRPhone,
  isValidBRPhone,
  normalizeBRPhone
} = require('../src');

function printHelp() {
  console.log(`br-phone-utils

Uso:
  br-phone normalize <telefone>
  br-phone validate <telefone>
  br-phone format <telefone> [--international]

Exemplos:
  br-phone normalize "+55 (11) 91234-5678"
  br-phone validate "(21) 2345-6789"
  br-phone format 11912345678 --international`);
}

function main(args) {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    return 0;
  }

  const [command, ...rest] = args;
  const international = rest.includes('--international');
  const valueParts = rest.filter((part) => part !== '--international');

  if (valueParts.length === 0) {
    console.error('Erro: informe um telefone.');
    return 2;
  }

  const value = valueParts.join(' ');

  switch (command) {
    case 'normalize':
      console.log(normalizeBRPhone(value));
      return 0;
    case 'validate': {
      const valid = isValidBRPhone(value);
      console.log(valid ? 'válido' : 'inválido');
      return valid ? 0 : 1;
    }
    case 'format':
      try {
        console.log(formatBRPhone(value, { international }));
        return 0;
      } catch (error) {
        console.error(`Erro: ${error.message}`);
        return 1;
      }
    default:
      console.error(`Erro: comando desconhecido: ${command}`);
      printHelp();
      return 2;
  }
}

process.exitCode = main(process.argv.slice(2));
