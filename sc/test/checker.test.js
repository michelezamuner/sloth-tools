const Checker = require('../src/checker');

describe('checker', () => {
  let checker = null;

  beforeEach(() => {
    checker = new Checker();
  });

  it('parses the main function', () => {
    const ast = {
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'argc' },
          { obj: 'arg', arg: 'argv' },
        ],
        body: { obj: 'ref', ref: '0' },
      },
    };

    const output = checker.parse(ast);

    expect(output).toStrictEqual({
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'argc', type: 'int' },
          { obj: 'arg', arg: 'argv', type: 'char[][]' },
        ],
        body: { obj: 'ref', ref: '0', type: 'int' },
      },
    });
  });
});
