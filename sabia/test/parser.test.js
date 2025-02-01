const { parse } = require('../src/parser');
const Lexer = require('../src/lexer');

describe('parser', () => {
  it('parses identity expression', () => {
    const code = `
      A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: 'A',
    });
  });

  it('parses sum type definition with single variant', () => {
    const code = `
      T: A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type_sum',
      id: 'T',
      body: [{ elem: 'cons', id: 'A' }],
    });
  });

  it('parses sum type definition with multiple variants', () => {
    const code = `
      T: A | B | C
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'type_sum',
      id: 'T',
      body: [
        { elem: 'cons', id: 'A' },
        { elem: 'cons', id: 'B' },
        { elem: 'cons', id: 'C' },
      ],
    });
  });

  it('parses sequence of sum type definition with single variant and expression', () => {
    const code = `
      T: A
      A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T',
          body: [{ elem: 'cons', id: 'A' }],
        },
        { elem: 'exp', var: 'id', id: 'A' },
      ],
    });
  });

  it('parses sequence of sum type definition and expression', () => {
    const code = `
      T: A | B | C
      A
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T',
          body: [
            { elem: 'cons', id: 'A' },
            { elem: 'cons', id: 'B' },
            { elem: 'cons', id: 'C' },
          ],
        },
        { elem: 'exp', var: 'id', id: 'A' },
      ],
    });
  });

  it('parses sequence of sum type definitions with single variant', () => {
    const code = `
      T1: A
      T2: B
      T3: C
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T1',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T2',
          body: [{ elem: 'cons', id: 'B' }],
        },
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T3',
          body: [{ elem: 'cons', id: 'C' }],
        },
      ],
    });
  });

  it('parses sequence of sum type definitions', () => {
    const code = `
      T1: A | B
      T2: B | C
      T3: C | D
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T1',
          body: [
            { elem: 'cons', id: 'A' },
            { elem: 'cons', id: 'B' },
          ],
        },
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T2',
          body: [
            { elem: 'cons', id: 'B' },
            { elem: 'cons', id: 'C' },
          ],
        },
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T3',
          body: [
            { elem: 'cons', id: 'C' },
            { elem: 'cons', id: 'D' },
          ],
        },
      ],
    });
  });

  it('parses function definition with single argument', () => {
    const code = `
      f: A -> B = a -> b
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'fun',
      id: 'f',
      type: { elem: 'type', id: 'A->B' },
      args: [{ elem: 'ptn', var: 'id', id: 'a' }],
      body: { elem: 'exp', var: 'id', id: 'b' },
    });
  });

  it('parses function definition with multiple arguments', () => {
    const code = `
      f: A, B, C -> D = a, b, c -> d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'fun',
      id: 'f',
      type: { elem: 'type', id: 'A,B,C->D' },
      args: [
        { elem: 'ptn', var: 'id', id: 'a' },
        { elem: 'ptn', var: 'id', id: 'b' },
        { elem: 'ptn', var: 'id', id: 'c' },
      ],
      body: { elem: 'exp', var: 'id', id: 'd' },
    });
  });

  it('parses evaluation expression', () => {
    const code = `
      a b c
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'exp',
      var: 'eval',
      fun: { elem: 'exp', var: 'id', id: 'a' },
      args: [
        { elem: 'exp', var: 'id', id: 'b' },
        { elem: 'exp', var: 'id', id: 'c' },
      ],
    });
  });

  it('parses function definition with evaluation body', () => {
    const code = `
      f: A -> B = a -> b c d
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'def',
      var: 'fun',
      id: 'f',
      type: { elem: 'type', id: 'A->B' },
      args: [{ elem: 'ptn', var: 'id', id: 'a' }],
      body: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'id', id: 'b' },
        args: [
          { elem: 'exp', var: 'id', id: 'c' },
          { elem: 'exp', var: 'id', id: 'd' },
        ],
      },
    });
  });

  it('parses sequence of function definition and evaluation expression', () => {
    const code = `
      f: A -> B = a -> b
      f a
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'fun',
          id: 'f',
          type: { elem: 'type', id: 'A->B' },
          args: [{ elem: 'ptn', var: 'id', id: 'a' }],
          body: { elem: 'exp', var: 'id', id: 'b' },
        },
        {
          elem: 'exp',
          var: 'eval',
          fun: { elem: 'exp', var: 'id', id: 'f' },
          args: [{ elem: 'exp', var: 'id', id: 'a' }],
        },
      ],
    });
  });

  it('parses external definition', () => {
    const code = `
      external_function: .qualifier.of.the.function
      external_function
    `;
    const lexemes = Lexer.parse(code);

    const ast = parse(lexemes);

    expect(ast).toStrictEqual({
      elem: 'seq',
      body: [{
        elem: 'def',
        var: 'ext',
        id: 'external_function',
        val: 'qualifier.of.the.function',
      }, {
        elem: 'exp',
        var: 'id',
        id: 'external_function',
      }]
    });
  });
});
