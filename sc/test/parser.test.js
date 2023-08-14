const Parser = require('../src/parser');

describe('parser', () => {
  let parser = null;

  beforeEach(() => {
    parser = new Parser();
  });

  it('parses references', () => {
    const lexemes = ['val'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({ obj: 'ref', id: 'val' });
  });

  it('parses expressions', () => {
    const lexemes = ['fun', 'val1', 'val2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'expr',
      fun: { obj: 'ref', id: 'fun' },
      args: [
        { obj: 'ref', id: 'val1' },
        { obj: 'ref', id: 'val2' },
      ],
    });
  });

  it('parses function literal', () => {
    const lexemes = ['arg1', 'arg2', '->', 'fun', 'arg1', 'arg2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'fun',
      args: [
        { obj: 'ref', id: 'arg1' },
        { obj: 'ref', id: 'arg2' },
      ],
      body: {
        obj: 'expr',
        fun: { obj: 'ref', id: 'fun' },
        args: [
          { obj: 'ref', id: 'arg1' },
          { obj: 'ref', id: 'arg2' },
        ],
      },
    });
  });

  it('parses definitions', () => {
    const lexemes = ['res', ':', 'fun', 'val1', 'val2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'def',
      id: 'res',
      val: {
        obj: 'expr',
        fun: { obj: 'ref', id: 'fun' },
        args: [
          { obj: 'ref', id: 'val1' },
          { obj: 'ref', id: 'val2' },
        ],
      },
    });
  });
});
