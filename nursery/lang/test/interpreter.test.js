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

  it('evaluates application of relation with multiple values', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'a',
        arg: ':a',
        val: ':b',
      },
      {
        obj: 'rel',
        id: 'a',
        arg: ':b',
        val: ':c',
      },
    ];

    const res1 = run([...ast, { obj: 'app', rel: 'a', arg: ':a' } ]);

    expect(res1).toStrictEqual(':b');

    const res2 = run([...ast, { obj: 'app', rel: 'a', arg: ':a' }, { obj: 'app', rel: 'a', arg: ':b' } ]);

    expect(res2).toStrictEqual(':c');
  });
});
