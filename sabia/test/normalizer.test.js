const { normalize } = require('../src/normalizer');
const Lexer = require('../src/lexer');
const Parser = require('../src/parser');

describe('normalizer', () => {
  it('normalize inline program', () => {
    const code = `
      T: A
      A
    `;
    const lexemes = Lexer.parse(code);
    const ast = Parser.parse(lexemes);

    const normalizedAst = normalize(ast);

    expect(normalizedAst).toStrictEqual({
      elem: 'seq',
      body: [
        {
          elem: 'def',
          var: 'type_sum',
          id: 'T',
          body: [{ elem: 'cons', id: 'A' }],
        },
        {
          elem: 'def',
          var: 'ext',
          id: 'proc',
          val: 'core.sys.process',
        },
        {
          elem: 'def',
          var: 'ext',
          id: 'exit',
          val: 'core.sys.exit',
        },
        {
          elem: 'def',
          var: 'ext',
          id: 'dbg',
          val: 'core.lang.debug',
        },
        {
          elem: 'def',
          var: 'fun',
          id: 'main',
          type: {
            elem: 'type',
            id: 'proc->exit'
          },
          args: [{ elem: 'ptn', var: 'id', id: '_' }],
          body: {
            elem: 'exp',
            var: 'eval',
            fun: { elem: 'exp', var: 'id', id: 'dbg' },
            args: [{ elem: 'exp', var: 'id', id: 'A' }],
          },
        },
      ],
    });
  });
});
