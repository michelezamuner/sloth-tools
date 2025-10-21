const Lexer = require('../../../src/frontends/enlil/lexer');
const Parser = require('../../../src/frontends/enlil/parser');

const flatten = arr => [].concat.apply([], arr);
const mix = (...sets) =>
  sets.reduce(
    (acc, set) => flatten(acc.map(x => set.map(y => [...x, y]))),
    [[]]
  );
const mods = () => [
  {
    code: '',
    expected: '',
  },
  {
    code: 'm1::m2::',
    expected: '::m1::m2::',
  },
];
const groups = () => [
  v => v,
  v => `(${v})`,
];
const ids = () => mix(mods(), groups())
  .map(
    ([m, g]) => ({
      code: g(`${m.code}a`),
      expected: { elem: 'exp', var: 'id', id: `${m.expected}a` },
    })
  );
const types = () => mods().map(m => ({
  code: `${m.code}Type`,
  expected: { elem: 'type', var: 'id', id: `${m.expected}Type` },
}));
const pats = () => types().map(t => ({
  code: `a: ${t.code}`,
  expected: {
    elem: 'pat',
    var: 'id',
    id: 'a',
    type: t.expected,
  },
}));
const enums = () => mix(types(), groups())
  .map(
    ([t, g]) => ({
      code: g(`${t.code}::A`),
      expected: {
        elem: 'exp',
        var: 'enum',
        type: t.expected,
        body: { elem: 'cons', type: t.expected, id: 'A' },
      },
    })
  );
const mock_calls = () => mix([
  ...ids(),
  ...enums(),
])
  .map(
    ([arg]) => ({
      code: `a(${arg.code})`,
      expected: {
        elem: 'exp',
        var: 'eval',
        fun: { elem: 'exp', var: 'id', id: 'a' },
        args: [ arg.expected ],
      },
    })
  );
const mock_closures = () => mix(
  pats(),
  types(),
  ids(),
  groups()
)
  // @todo: should this really be a flat map?
  .flatMap(
    ([p, t, id, g]) => ({
      code: g(`|${p.code}| -> ${t.code} { ${id.code} }`),
      expected: {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          var: 'fun',
          args: [p.expected.type],
          ret: t.expected,
        },
        args: [p.expected],
        body: id.expected,
      },
    })
  );
const exps = () => [
  ...ids(),
  ...enums(),
  ...mock_calls(),
  ...mock_closures(),
];
const calls = () => mix(
  [
    ...ids(),
    ...mock_calls(),
    ...mock_closures(),
  ],
  exps(),
  exps(),
  groups()
)
  .flatMap(
    ([f, a1, a2, g]) => [
      {
        code: g(`${f.code}(${a1.code})`),
        expected: {
          elem: 'exp',
          var: 'eval',
          fun: f.expected,
          args: [ a1.expected ],
        },
      },
      {
        code: g(`${f.code}(${a1.code}, ${a2.code})`),
        expected: {
          elem: 'exp',
          var: 'eval',
          fun: f.expected,
          args: [ a1.expected, a2.expected ],
        },
      },
    ]
  )
  .filter((value, index, self) => self.findIndex(v => v.code === value.code) === index)
;
const closures = () => mix(
  pats(),
  pats(),
  types(),
  exps(),
  groups()
)
  .flatMap(
    ([a1, a2, t, e, g]) => [
      {
        code: g(`|${a1.code}| -> ${t.code} { ${e.code} }`),
        expected: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [a1.expected.type],
            ret: t.expected,
          },
          args: [a1.expected],
          body: e.expected,
        },
      },
      {
        code: g(`|${a1.code}, ${a2.code}| -> ${t.code} { ${e.code} }`),
        expected: {
          elem: 'exp',
          var: 'fun',
          type: {
            elem: 'type',
            var: 'fun',
            args: [a1.expected.type, a2.expected.type],
            ret: t.expected,
          },
          args: [a1.expected, a2.expected],
          body: e.expected,
        },
      },
    ]
  )
  .filter((value, index, self) => self.findIndex(v => v.code === value.code) === index)
;
const vis = () => [
  {
    code: '',
    expected: 'priv',
  },
  {
    code: 'pub',
    expected: 'pub',
  },
];
const enum_defs = () => vis().flatMap(v => [
  {
    code: `${v.code} enum T { A }`.trim(),
    expected: {
      elem: 'def',
      var: 'enum',
      id: 'T',
      vis: v.expected,
      body: [
        {
          elem: 'cons',
          type: { elem: 'type', var: 'id', id: 'T' },
          id: 'A'
        },
      ],
    },
  },
  {
    code: `${v.code} enum T { A, B }`.trim(),
    expected: {
      elem: 'def',
      var: 'enum',
      id: 'T',
      vis: v.expected,
      body: [
        {
          elem: 'cons',
          type: { elem: 'type', var: 'id', id: 'T' },
          id: 'A'
        },
        {
          elem: 'cons',
          type: { elem: 'type', var: 'id', id: 'T' },
          id: 'B'
        },
      ],
    },
  },
]);

const const_defs = () => mix(
  vis(),
  exps()
)
  .map(
    ([v, e]) => ({
      code: `${v.code} const a = ${e.code};`.trim(),
      expected: {
        elem: 'def',
        var: 'ref',
        id: 'a',
        vis: v.expected,
        body: e.expected,
      },
    })
  );
const fun_defs = () => mix(
  vis(),
  pats(),
  pats(),
  types(),
  exps(),
)
  .flatMap(
    ([v, a1, a2, t, e]) => [
      {
        code: `${v.code} fn fun(${a1.code}) -> ${t.code} { ${e.code} }`.trim(),
        expected: {
          elem: 'def',
          var: 'ref',
          id: 'fun',
          vis: v.expected,
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [a1.expected.type],
              ret: t.expected,
            },
            args: [a1.expected],
            body: e.expected,
          }
        },
      },
      {
        code: `${v.code} fn fun(${a1.code}, ${a2.code}) -> ${t.code} { ${e.code} }`.trim(),
        expected: {
          elem: 'def',
          var: 'ref',
          id: 'fun',
          vis: v.expected,
          body: {
            elem: 'exp',
            var: 'fun',
            type: {
              elem: 'type',
              var: 'fun',
              args: [a1.expected.type, a2.expected.type],
              ret: t.expected,
            },
            args: [a1.expected, a2.expected],
            body: e.expected,
          }
        },
      },
    ]
  )
  .filter((value, index, self) => self.findIndex(v => v.code === value.code) === index)
;
const defs = () => [
  ...enum_defs(),
  ...const_defs(),
  ...fun_defs(),
];
const mod_defs = () => mix(
  defs(),
  defs(),
  defs()
)
  .flatMap(
    ([def1, def2, def3]) => [
      {
        code: `mod m {${def1.code}}`,
        expected: {
          elem: 'mod',
          id: 'm',
          body: [ def1.expected ],
        },
      },
      {
        code: `mod m {${def1.code}${def2.code}}`,
        expected: {
          elem: 'mod',
          id: 'm',
          body: [ def1.expected, def2.expected ],
        },
      },
      {
        code: `mod m {${def1.code}${def2.code}${def3.code}}`,
        expected: {
          elem: 'mod',
          id: 'm',
          body: [ def1.expected, def2.expected, def3.expected ],
        },
      },
    ]
  )
  .filter((value, index, self) => self.findIndex(v => v.code === value.code) === index)
;

describe('enlil parser', () => {
  it.each(types())('parses type `$code`', ({ code, expected }) => {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  it.each(ids())('parses id expression `$code`', ({ code, expected })=> {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  it.each(enums())('parses enum expression `$code`', ({ code, expected })=> {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  // This test is too heavy to be run along with the others
  // it.skip.each(calls())('parses function call `$code`', ({ code, expected })=> {
  //   const lexemes = Resolver.parse(Lexer.parse(code));

  //   const ast = Parser.parse(lexemes);

  //   expect(ast).toStrictEqual(expected);
  // });

  it.each(closures())('parses closure `$code`', ({ code, expected }) => {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  it.each(enum_defs())('parses enum definition `$code`', ({ code, expected }) => {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  it.each(const_defs())('parses const definition `$code`', ({ code, expected }) => {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  it.each(fun_defs())('parses function definition `$code`', ({ code, expected }) => {
    const lexemes = Lexer.parse(code);

    const ast = Parser.parse(lexemes);

    expect(ast).toStrictEqual(expected);
  });

  // This test is too heavy to be run along with the others
  // it.skip.each(mod_defs())('parses mod `$code`', ({ code, expected }) => {
  //   const lexemes = Resolver.parse(Lexer.parse(code));

  //   const ast = Parser.parse(lexemes);

  //   expect(ast).toStrictEqual(expected);
  // });
});
