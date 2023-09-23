const run = require('../src/interpreter').run;

describe('interpreter', () => {
  it('evaluates relation', () => {
    const ast = [{
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c' },
    }];

    const result = run(ast);

    expect(result).toStrictEqual({
      obj: 'rel',
      id: 'a',
      rel: { ':b': ':c' },
    });
  });

  it('evaluates application', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'a',
        rel: { ':b': ':c' },
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

  it('evaluates application of anonymous relation', () => {
    const ast = [{
      obj: 'app',
      rel: {
        obj: 'rel',
        rel: { ':b': ':c' },
      },
      arg: ':b',
    }];

    const result = run(ast);

    expect(result).toStrictEqual(':c');
  });

  it('evaluates compound applications', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'rel',
        rel: { ':b': ':c' },
      },
      {
        obj: 'app',
        rel: {
          obj: 'app',
          rel: {
            obj: 'rel',
            rel: { ':a': 'rel' },
          },
          arg: ':a',
        },
        arg: ':b',
      }
    ];

    const result = run(ast);

    expect(result).toStrictEqual(':c');
  });

  it('evaluates multiple relations', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'a',
        rel: { ':b': ':c' },
      },
      {
        obj: 'rel',
        id: 'd',
        rel: { ':e': ':f' },
      },
    ];

    const result = run(ast);

    expect(result).toStrictEqual({
      obj: 'rel',
      id: 'd',
      rel: { ':e': ':f' },
    });
  });

  it('evaluates application of relation with multiple values', () => {
    const ast = [
      {
        obj: 'rel',
        id: 'a',
        rel: { ':a': ':b', ':b': ':c' },
      },
    ];

    const res1 = run([...ast, { obj: 'app', rel: 'a', arg: ':a' } ]);

    expect(res1).toStrictEqual(':b');

    const res2 = run([...ast, { obj: 'app', rel: 'a', arg: ':a' }, { obj: 'app', rel: 'a', arg: ':b' } ]);

    expect(res2).toStrictEqual(':c');
  });
});
