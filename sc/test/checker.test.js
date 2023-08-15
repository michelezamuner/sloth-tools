const Checker = require('../src/checker');

describe('checker', () => {
  let checker = null;

  beforeEach(() => {
    checker = new Checker();
  });

  it('parses the main function', () => {
    const ast = {
      obj: 'def',
      id: '_',
      val: {
        obj: 'fun',
        args: [
          { obj: 'ref', id: 'argc' },
          { obj: 'ref', id: 'argv' },
        ],
        body: { obj: 'ref', id: '0' },
      },
    };
    const output = checker.parse(ast);

    expect(output).toStrictEqual({
      obj: 'def',
      id: '_',
      val: {
        obj: 'fun',
        args: [
          { obj: 'ref', id: 'argc', type: 'size' },
          { obj: 'ref', id: 'argv', type: 'char[][]' },
        ],
        body: { obj: 'ref', id: '0', type: 'uint8' },
      },
    });
  });
});