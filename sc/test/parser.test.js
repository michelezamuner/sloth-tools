const Parser = require('../src/parser');

describe('parser', () => {
  let parser = null;

  beforeEach(() => {
    parser = new Parser();
  });

  it('parses references', () => {
    const lexemes = ['some.ref'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({ obj: 'ref', id: 'some.ref' });
  });

  it('parses scalar literals', () => {
    const lexemes = ['0'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({ obj: 'val', val: '0' });
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

  it('parses function literals', () => {
    const lexemes = ['arg1', 'arg2', '->', 'fun', 'arg1', 'arg2'];
    const ast = parser.parse(lexemes);

    expect(ast).toStrictEqual({
      obj: 'val',
      val: {
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
