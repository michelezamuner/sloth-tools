const { parse } = require('../src/lexer');
const { s, z } = require('./utils');

describe('lexer', () => {
  it('parses single lexeme', () => {
    const code = `
      a
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['a', { scope: -1 }]);
  });

  it('parses enum definition', () => {
    const code = `
      Type${z()}=${z()}First${z()}|${z()}Second${z()}|${z()}Third
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['Type', '=', 'First', '|', 'Second', '|', 'Third', { scope: -1 }]);
  });

  it('parses function definition', () => {
    const code = `
      fun${z()}:${z()}Type${z()}=${z()}first${z()}second${z()}->${z()}value
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual([
      'fun',
      ':',
      'Type',
      '=',
      'first',
      'second',
      '->',
      'value',
      { scope: -1 },
    ]);
  });

  it('parses evaluation expression', () => {
    const code = `
      function${s()}arg1${s()}arg2
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['function', 'arg1', 'arg2', { scope: -1 }]);
  });

  it('parses external reference', () => {
    const code = `
      alias = some::external::ref
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['alias', '=', 'some::external::ref', { scope: -1 }]);
  });

  it('parses code in parenthesis', () => {
    const code = `
      (fun arg1 arg2)
    `;
    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['(', 'fun', 'arg1', 'arg2', ')', { scope: -1 }]);
  });

  it('parses code with indentation', () => {
    const code = `
      f
        a
          b
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['f', { scope: 2 }, 'a', { scope: 4 }, 'b', { scope: -1 }]);
  });
});
