const { type } = require('../src/typer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Indexer = require('../src/indexer');

describe('typer', () => {
  it('adds type to identity expression of sum type', () => {
    const code = `
      T: A
      A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst.body[1]).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: 'A',
      type: { elem: 'type', id: 'T' },
    });
  });

  it('adds type to function definition', () => {
    const code = `
      A: B
      C: D
      f: A, A -> C = a, b -> D
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst.body[2].args[0]).toStrictEqual({
      elem: 'ptn',
      var: 'id',
      id: 'a',
      type: { elem: 'type', id: 'A' },
    });
    expect(typedAst.body[2].args[1]).toStrictEqual({
      elem: 'ptn',
      var: 'id',
      id: 'b',
      type: { elem: 'type', id: 'A' },
    });
    expect(typedAst.body[2].body).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: 'D',
      type: { elem: 'type', id: 'C' },
    });
  });

  it('adds type to evaluation expression', () => {
    const code = `
      T1: A
      T2: B
      f: T1 -> T2 = a -> B
      f A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst.body[3].fun.type).toStrictEqual({
      elem: 'type',
      id: 'T1->T2',
    });

    expect(typedAst.body[3].type).toStrictEqual({
      elem: 'type',
      id: 'T2',
    });

    expect(typedAst.body[3].args[0].type).toStrictEqual({
      elem: 'type',
      id: 'T1',
    });
  });

  it('adds type to function definition with evaluation expression', () => {
    const code = `
      A: B
      g: A -> A = a -> a
      f: A -> A = a -> g a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst.body[2].body.args[0]).toStrictEqual({
      elem: 'exp',
      var: 'id',
      id: 'a',
      type: { elem: 'type', id: 'A' },
    });
  });

  it('adds type to external definition', () => {
    const code = `
      dbg: .core.lang.debug
      A: A
      f: A -> A = a -> dbg a
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);
    const index = Indexer.index(ast);

    const typedAst = type(ast, index);

    expect(typedAst.body[0]).toStrictEqual({
      elem: 'def',
      var: 'ext',
      id: 'dbg',
      val: 'core.lang.debug',
      type: { elem: 'type', id: '<A>-><A>' },
    });

    expect(typedAst.body[2].body.args[0].type).toStrictEqual({
      elem: 'type', id: 'A',
    });
  });
});
