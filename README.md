# br-phone-utils

Biblioteca e CLI em Node.js para normalizar, validar e formatar telefones brasileiros. O projeto não possui dependências de produção.

## Recursos

- remove espaços, parênteses, hífens e o código internacional `+55`;
- valida o comprimento, o DDD e padrões básicos de fixos e celulares;
- formata números no padrão nacional ou internacional;
- oferece API CommonJS e uma CLI simples.

> A validação é estrutural. Ela não confirma se uma linha existe, está ativa ou pertence a uma pessoa.

## Requisitos

- Node.js 18 ou superior.

## Instalação

Clone o repositório e, dentro da pasta, execute:

```bash
npm install
```

Também é possível instalar localmente em outro projeto:

```bash
npm install /caminho/para/br-phone-utils
```

## Uso como biblioteca

```js
const {
  formatBRPhone,
  isValidBRPhone,
  normalizeBRPhone
} = require('br-phone-utils');

normalizeBRPhone('+55 (11) 91234-5678');
// '11912345678'

isValidBRPhone('(21) 2345-6789');
// true

formatBRPhone('11912345678');
// '(11) 91234-5678'

formatBRPhone('11912345678', { international: true });
// '+55 (11) 91234-5678'
```

`normalizeBRPhone` aceita string ou número. `isValidBRPhone` sempre devolve um booleano. `formatBRPhone` lança `RangeError` quando o telefone é inválido.

## Uso pela linha de comando

Depois de `npm install`, use `npm exec`:

```bash
npm exec br-phone -- normalize "+55 (11) 91234-5678"
npm exec br-phone -- validate "(21) 2345-6789"
npm exec br-phone -- format 11912345678 --international
```

Saídas esperadas:

```text
11912345678
válido
+55 (11) 91234-5678
```

O comando `validate` retorna status `0` para números válidos e `1` para inválidos, facilitando seu uso em scripts.

## Desenvolvimento

```bash
npm test
npm run check
```

Os testes usam o módulo nativo `node:test`. A integração contínua executa a suíte no Node.js 18, 20 e 22.

## Limites da validação

Telefones fixos devem ter DDD válido, oito dígitos locais e começar com `2`, `3`, `4` ou `5`. Celulares devem ter DDD válido, nove dígitos locais e começar com `9`. Regras especiais, números de serviço, ramais e discagem com código de operadora não são tratados.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
