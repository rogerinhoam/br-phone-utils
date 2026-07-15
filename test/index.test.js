'use strict';

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const {
  formatBRPhone,
  isValidBRPhone,
  normalizeBRPhone
} = require('../src');

test('normaliza pontuação e código do Brasil', () => {
  assert.equal(normalizeBRPhone('+55 (11) 91234-5678'), '11912345678');
  assert.equal(normalizeBRPhone('(21) 2345-6789'), '2123456789');
  assert.equal(normalizeBRPhone(11912345678), '11912345678');
});

test('não remove 55 quando ele é o DDD de um número nacional', () => {
  assert.equal(normalizeBRPhone('55912345678'), '55912345678');
});

test('rejeita tipos incompatíveis na normalização', () => {
  assert.throws(() => normalizeBRPhone(null), TypeError);
});

test('valida celulares e telefones fixos', () => {
  assert.equal(isValidBRPhone('(11) 91234-5678'), true);
  assert.equal(isValidBRPhone('+55 21 2345-6789'), true);
  assert.equal(isValidBRPhone('55912345678'), true);
});

test('rejeita comprimento, DDD e prefixos inválidos', () => {
  assert.equal(isValidBRPhone('10123456789'), false);
  assert.equal(isValidBRPhone('1161234567'), false);
  assert.equal(isValidBRPhone('11812345678'), false);
  assert.equal(isValidBRPhone('1234'), false);
  assert.equal(isValidBRPhone(undefined), false);
});

test('formata números nacionais e internacionais', () => {
  assert.equal(formatBRPhone('11912345678'), '(11) 91234-5678');
  assert.equal(formatBRPhone('2123456789'), '(21) 2345-6789');
  assert.equal(
    formatBRPhone('11912345678', { international: true }),
    '+55 (11) 91234-5678'
  );
});

test('falha ao tentar formatar telefone inválido', () => {
  assert.throws(() => formatBRPhone('1234'), RangeError);
});

test('CLI normaliza e formata', () => {
  const cli = path.join(__dirname, '..', 'bin', 'br-phone.js');
  const normalizeOutput = execFileSync(process.execPath, [cli, 'normalize', '+55 (11) 91234-5678'], {
    encoding: 'utf8'
  });
  const formatOutput = execFileSync(process.execPath, [cli, 'format', '11912345678', '--international'], {
    encoding: 'utf8'
  });

  assert.equal(normalizeOutput.trim(), '11912345678');
  assert.equal(formatOutput.trim(), '+55 (11) 91234-5678');
});

test('CLI sinaliza número inválido com status 1', () => {
  const cli = path.join(__dirname, '..', 'bin', 'br-phone.js');
  const result = spawnSync(process.execPath, [cli, 'validate', '1234'], { encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.equal(result.stdout.trim(), 'inválido');
});
