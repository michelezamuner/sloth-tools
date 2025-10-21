const Lexer = require('../../../src/frontends/enlil/lexer');

describe('enlil lexer', () => {
  it('parses enum expression', () => {
    const code = `
      Type::Constructor
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['Type', '::', 'Constructor']);
  });

  it('parses fq enum expression', () => {
    const code = `
      module::Type::Constructor
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['module', '::', 'Type', '::', 'Constructor']);
  });

  it('parses id expression', () => {
    const code = `
      id_expression
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['id_expression']);
  });

  it('parses fq id expression', () => {
    const code = `
      module1::module2::id_expression
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['module1', '::', 'module2', '::', 'id_expression']);
  });

  it('parses function call with single argument', () => {
    const code = `
      function (Type::Constructor)
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', 'Type', '::', 'Constructor', ')']);
  });

  it('parses function call with group argument', () => {
    const code = `
      function ((id_expression))
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', '(', 'id_expression', ')', ')']);
  });

  it('parses function call with fq function', () => {
    const code = `
      module1::module2::function (id_expression)
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['module1', '::', 'module2', '::', 'function', '(', 'id_expression', ')']);
  });

  it('parses function call with fq arg', () => {
    const code = `
      function (module1::module2::id_expression)
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', 'module1', '::', 'module2', '::', 'id_expression', ')']);
  });

  it('parses multiline function call', () => {
    const code = `
      function
        (
          id_expression
        )
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', 'id_expression', ')']);
  });

  it('parses function call with multiple arguments', () => {
    const code = `
      function(Type::Constructor, id_expression)
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', 'Type', '::', 'Constructor', ',', 'id_expression', ')']);
  });

  it('parses function call with function call arg', () => {
    const code = `
      function(id_expression, function(id_expression))
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['function', '(', 'id_expression', ',', 'function', '(', 'id_expression', ')', ')']);
  });

  it('parses closure with single argument', () => {
    const code = `
      |pattern: Type| -> Type { body }
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['|', 'pattern', ':', 'Type', '|', '->', 'Type', '{', 'body', '}']);
  });

  it('parses closure with multiple arguments', () => {
    const code = `
      |pattern: Type, pattern: Type| -> Type { body }
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['|', 'pattern', ':', 'Type', ',', 'pattern', ':', 'Type', '|', '->', 'Type', '{', 'body', '}']);
  });

  it('parses enum definition', () => {
    const code = `
      enum Type { Cons, Cons }
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['enum', 'Type', '{', 'Cons', ',', 'Cons', '}']);
  });

  it('parses const definition', () => {
    const code = `
      const a = b;
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['const', 'a', '=', 'b', ';']);
  });

  it('parses function definition', () => {
    const code = `
      fn myfn(arg: Type) -> Type { body }
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['fn', 'myfn', '(', 'arg', ':', 'Type', ')', '->', 'Type', '{', 'body', '}']);
  });

  it('parses module', () => {
    const code = `
      mod module {enum T { A }}
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['mod', 'module', '{', 'enum', 'T', '{', 'A', '}', '}']);
  });

  it('parses aliases', () => {
    const code = `
      alias module::submod::Type;
    `;

    const lexemes = Lexer.parse(code);

    expect(lexemes).toStrictEqual(['alias', 'module', '::', 'submod', '::', 'Type', ';']);
  });
});
