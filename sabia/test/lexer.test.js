const { parse } = require('../src/lexer');
const { s, z } = require('./utils');

describe('lexer', () => {
  it('parses single lexeme', () => {
    const code = `
      A
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['A']);
  });

  it('parses sum type definition', () => {
    const code = `
      Type${z()}:${z()}First${z()}|${z()}Second${z()}|${z()}Third
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['Type', ':', 'First', '|', 'Second', '|', 'Third']);
  });

  it('parses sequence', () => {
    const code = `
      Type: First | Second
      First
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['Type', ':', 'First', '|', 'Second', { i: 0 }, 'First']);
  });

  it('parses function definition', () => {
    const code = `
      fun${z()}:${z()}First${z()},${z()}Second${z()}->${z()}Return${z()}=${z()}first${z()},${z()}second${z()}->${z()}value
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual([
      'fun',
      ':',
      'First',
      ',',
      'Second',
      '->',
      'Return',
      '=',
      'first',
      ',',
      'second',
      '->',
      'value',
    ]);
  });

  it('parses evaluation expression', () => {
    const code = `
      function${s()}arg1${s()}arg2
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['function', 'arg1', 'arg2']);
  });

  it('parses code in parenthesis', () => {
    const code = `
      (fun arg1 arg2)
    `;
    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['(', 'fun', 'arg1', 'arg2', ')']);
  });

  it('parses code with indentation', () => {
    const code = `
      f
        a
          b
    `;

    const lexemes = parse(code);

    expect(lexemes).toStrictEqual(['f', { i: 2 }, 'a', { i: 4 }, 'b']);
  });
});
