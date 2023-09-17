const run = require('../src/interpreter').run;

describe('interpreter', () => {
  it('evaluates relation definition', () => {
    const ast = {
      obj: 'rel',
      id: 'a',
      arg: ':b',
      val: ':c',
    };

    const result = run(ast);

    expect(result).toStrictEqual({
      obj: 'rel',
      id: 'a',
      arg: ':b',
      val: ':c',
    });
  });

  it('evaluates application', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'a',
        arg: ':b',
        val: ':c',
      },
      {
        obj: 'app',
        rel: 'a',
        arg: ':b',
      },
    ];

    const result = run(ast);

    expect(result).toStrictEqual(':c');
  });
});
