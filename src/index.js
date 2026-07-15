'use strict';

const VALID_AREA_CODES = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
]);

/**
 * Remove pontuação e o código internacional +55, quando presente.
 *
 * @param {string|number} value telefone de entrada
 * @returns {string} telefone nacional contendo apenas dígitos
 */
function normalizeBRPhone(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new TypeError('O telefone deve ser uma string ou um número.');
  }

  let digits = String(value).replace(/\D/g, '');

  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    digits = digits.slice(2);
  }

  return digits;
}

/**
 * Faz uma validação básica de DDD e padrão de número fixo/celular.
 * Fixos têm 10 dígitos e começam com 2–5; celulares têm 11 e começam com 9.
 *
 * @param {string|number} value telefone de entrada
 * @returns {boolean}
 */
function isValidBRPhone(value) {
  let digits;

  try {
    digits = normalizeBRPhone(value);
  } catch {
    return false;
  }

  if (!VALID_AREA_CODES.has(digits.slice(0, 2))) {
    return false;
  }

  if (digits.length === 10) {
    return /^[1-9]{2}[2-5]\d{7}$/.test(digits);
  }

  if (digits.length === 11) {
    return /^[1-9]{2}9\d{8}$/.test(digits);
  }

  return false;
}

/**
 * Formata um telefone brasileiro válido.
 *
 * @param {string|number} value telefone de entrada
 * @param {{ international?: boolean }} [options]
 * @returns {string}
 * @throws {RangeError} quando o número não passa na validação básica
 */
function formatBRPhone(value, options = {}) {
  const digits = normalizeBRPhone(value);

  if (!isValidBRPhone(digits)) {
    throw new RangeError('Telefone brasileiro inválido.');
  }

  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  const splitAt = subscriber.length === 9 ? 5 : 4;
  const formatted = `(${areaCode}) ${subscriber.slice(0, splitAt)}-${subscriber.slice(splitAt)}`;

  return options.international ? `+55 ${formatted}` : formatted;
}

module.exports = {
  formatBRPhone,
  isValidBRPhone,
  normalizeBRPhone
};
