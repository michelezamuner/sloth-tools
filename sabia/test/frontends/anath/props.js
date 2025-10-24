const spaces = ['', ' ', '\n'];
const groups = spaces.map(s => ({
  code: v => `(${s}${v}${s})`,
  lex: v => ['('].concat(v).concat([')']),
})).concat([
  {
    code: v => v,
    lex: v => v,
  }
]);
const mods = [
  {
    code: '',
    lex: [],
    ast: ''
  },
  {
    code: 'mod::',
    lex: ['mod', '::'],
    ast: 'mod::'
  },
  {
    code: 'mod1::mod2::',
    lex: ['mod1', '::', 'mod2', '::'],
    ast: 'mod1::mod2::'
  },
];
const ref_exps = mix(
  groups,
  mods
).map(([g, m]) => ({
  code: g.code(`${m.code}ref`),
  lex: g.lex(m.lex.concat(['ref'])),
  ast: { elem: 'exp', var: 'ref', name: `${m.ast}ref` },
}));
const types = mods.flatMap(m => [
  {
    code: `${m.code}Type`,
    lex: m.lex.concat(['Type']),
    ast: {
      elem: 'type',
      name: `${m.ast}Type`,
      params: [],
    },
  },
  {
    code: `${m.code}Type<Type1>`,
    lex: m.lex.concat(['Type', '<', 'Type1', '>']),
    ast: {
      elem: 'type',
      name: `${m.ast}Type`,
      params: [{ elem: 'type', name: 'Type1', params: [] }],
    },
  },
  {
    code: `${m.code}Type<Type1, Type2>`,
    lex: m.lex.concat(['Type', '<', 'Type1', ',', 'Type2', '>']),
    ast: {
      elem: 'type',
      name: `${m.ast}Type`,
      params: [
        { elem: 'type', name: 'Type1', params: [] },
        { elem: 'type', name: 'Type2', params: [] },
      ],
    },
  },
  {
    code: `${m.code}Type<Type1, Type2<Type3>>`,
    lex: m.lex.concat(['Type', '<', 'Type1', ',', 'Type2', '<', 'Type3', '>', '>']),
    ast: {
      elem: 'type',
      name: `${m.ast}Type`,
      params: [
        { elem: 'type', name: 'Type1', params: [] },
        {
          elem: 'type',
          name: 'Type2',
          params: [{ elem: 'type', name: 'Type3', params: [] }]
        },
      ],
    },
  },
]);
const cons_exps = mix(
  types,
  groups
).map(([t, g]) => ({
  code: g.code(`${t.code}::Cons`),
  lex: g.lex(t.lex.concat(['::', 'Cons'])),
  ast: {
    elem: 'exp',
    var: 'cons',
    type: t.ast,
    name: 'Cons',
  },
}));
const mock_eval_exps = map(cat(
  cons_exps,
  ref_exps,
), a => ({
  code: `(fun ${a.code})`,
  lex: ['(', 'fun']
    .concat(a.lex)
    .concat([')']),
  ast: {
    elem: 'exp',
    var: 'eval',
    fun: { elem: 'exp', var: 'ref', name: 'fun' },
    arg: a.ast,
  },
}));
const mock_fun_exps = map(m4(
  types,
  types,
  ref_exps,
  groups
), ([t1, t2, r, g]) => ({
  code: g.code(`a: ${t1.code} -> ${t2.code} ${r.code}`),
  lex: g.lex(['a', ':']
    .concat(t1.lex)
    .concat(['->'])
    .concat(t2.lex)
    .concat(r.lex)),
  ast: {
    elem: 'exp',
    var: 'fun',
    type: {
      elem: 'type',
      name: 'core::lang::Fun',
      params: [t1.ast, t2.ast],
    },
    arg: {
      elem: 'def',
      var: 'arg',
      name: 'a',
      type: t1.ast,
    },
    body: r.ast,
  },
}));
const exps = p => cat_r(
  p,
  cons_exps,
  ref_exps,
  mock_eval_exps,
  mock_fun_exps,
);
const eval_exps = p => map(m4(
  spaces,
  exps(p),
  exps(p),
  groups
), ([s, f, a, g]) => ({
  code: g.code(`${f.code} ${s}${a.code}`),
  lex: g.lex(f.lex
    .concat(a.lex)),
  ast: {
    elem: 'exp',
    var: 'eval',
    fun: f.ast,
    arg: a.ast,
  }
}));
const fun_exps = p => map(m5(
  spaces,
  types,
  types,
  exps(p),
  groups
), ([s, t1, t2, e, g]) => (
  {
    code: g.code(`a${s}:${s}${t1.code}${s}->${s}${t2.code} ${s}${e.code}`),
    lex: g.lex(['a', ':']
      .concat(t1.lex)
      .concat(['->'])
      .concat(t2.lex)
      .concat(e.lex)),
    ast: {
      elem: 'exp',
      var: 'fun',
      type: {
        elem: 'type',
        name: 'core::lang::Fun',
        params: [t1.ast, t2.ast],
      },
      arg: {
        elem: 'def',
        var: 'arg',
        name: 'a',
        type: t1.ast,
      },
      body: e.ast,
    },
  }
));
const vis = [
  {
    code: '',
    lex: [],
    ast: 'priv',
  },
  {
    code: '::',
    lex: ['::'],
    ast: 'pub',
  },
];
const cons = ['Cons1', 'Cons2', 'Cons3'];
const type_defs = mix(
  spaces,
  vis,
  cons,
).flatMap(([s, v, c]) => ([
  {
    code: `${v.code}Type${s}=${s}${c}${s};`,
    lex: v.lex.concat(['Type', '=', c, ';']),
    ast: {
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: [],
      vis: v.ast,
      body: [{ elem: 'cons', name: c, arg: null }],
    },
  },
  {
    code: `${v.code}Type${s}=${s}${c}${s}|${s}${c}${s};`,
    lex: v.lex.concat(['Type', '=', c, '|', c, ';']),
    ast: {
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: [],
      vis: v.ast,
      body: [
        { elem: 'cons', name: c, arg: null },
        { elem: 'cons', name: c, arg: null },
      ],
    },
  },
  {
    code: `${v.code}Type<U>${s}=${s}${c} ${s}U${s}|${s}${c}${s};`,
    lex: v.lex.concat(['Type', '<', 'U', '>', '=', c, 'U', '|', c, ';']),
    ast: {
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: [{ elem: 'type', name: 'U', params: [] }],
      vis: v.ast,
      body: [
        {
          elem: 'cons',
          name: c,
          arg: { elem: 'type', name: 'U', params: [] },
        },
        { elem: 'cons', name: c, arg: null },
      ],
    },
  },
  {
    code: `${v.code}Type<U, V>${s}=${s}${c} ${s}U${s}|${s}${c} ${s}V${s};`,
    lex: v.lex.concat(['Type', '<', 'U', ',', 'V', '>', '=', c, 'U', '|', c, 'V', ';']),
    ast: {
      elem: 'def',
      var: 'type',
      name: 'Type',
      params: [
        { elem: 'type', name: 'U', params: [] },
        { elem: 'type', name: 'V', params: [] },
      ],
      vis: v.ast,
      body: [
        {
          elem: 'cons',
          name: c,
          arg: { elem: 'type', name: 'U', params: [] },
        },
        {
          elem: 'cons',
          name: c,
          arg: { elem: 'type', name: 'V', params: [] },
        },
      ],
    },
  },
]));
const ref_defs = p => map(m3(
  spaces,
  vis,
  exps(p)
), ([s, v, e]) => ({
  code: `${v.code}ref${s}=${s}${e.code}${s};`,
  lex: v.lex.concat(['ref', '='])
    .concat(e.lex)
    .concat([';']),
  ast: {
    elem: 'def',
    var: 'ref',
    name: 'ref',
    vis: v.ast,
    body: e.ast,
  },
}));
const mod_defs = p => map(m4(
  spaces,
  vis,
  cat_r(
    p,
    type_defs,
    ref_defs(p)
  ),
  cat_r(
    p,
    type_defs,
    ref_defs(p)
  )
), ([s, v, d1, d2]) => ([
  {
    code: `${v.code}mod${s}{${s}${d1.code}${s}}`,
    lex: v.lex.concat(['mod', '{'])
      .concat(d1.lex)
      .concat(['}']),
    ast: {
      elem: 'def',
      var: 'mod',
      name: 'mod',
      vis: v.ast,
      body: [d1.ast],
    },
  },
  {
    code: `${v.code}mod${s}{${s}${d1.code}${s}${d2.code}${s}}`,
    lex: v.lex.concat(['mod', '{'])
      .concat(d1.lex)
      .concat(d2.lex)
      .concat(['}']),
    ast: {
      elem: 'def',
      var: 'mod',
      name: 'mod',
      vis: v.ast,
      body: [d1.ast, d2.ast],
    },
  },
]));

exports.cons_exps = () => cons_exps;
exports.ref_exps = () => ref_exps;
exports.eval_exps = p => [...eval_exps(p)];
exports.fun_exps = p => [...fun_exps(p)];
exports.type_defs = () => type_defs;
exports.ref_defs = p => [...ref_defs(p)];
exports.mod_defs = p => [...mod_defs(p)];

function flatten(arr) {
  return [].concat.apply([], arr);
}
function mix(...sets) {
  return sets.reduce(
    (acc, set) => flatten(acc.map(x => set.map(y => [...x, y]))),
    [[]]
  );
}

function cat(...sets) {
  return {
    *[Symbol.iterator]() {
      for (const set of sets) {
        for (const val of set) {
          yield val;
        }
      }
    }
  };
}

function cat_r(p, ...sets) {
  return {
    *[Symbol.iterator]() {
      for (const set of sets) {
        for (const val of set) {
          if (Math.random() > p) {
            continue;
          }
          yield val;
        }
      }
    }
  };
}

function m3(set1, set2, set3) {
  return {
    *[Symbol.iterator]() {
      for (const data1 of set1) {
        for (const data2 of set2) {
          for (const data3 of set3) {
            yield [data1, data2, data3];
          }
        }
      }
    },
  };
}

function m4(set1, set2, set3, set4) {
  return {
    *[Symbol.iterator]() {
      for (const data1 of set1) {
        for (const data2 of set2) {
          for (const data3 of set3) {
            for (const data4 of set4) {
              yield [data1, data2, data3, data4];
            }
          }
        }
      }
    },
  };
}

function m5(set1, set2, set3, set4, set5) {
  return {
    *[Symbol.iterator]() {
      for (const data1 of set1) {
        for (const data2 of set2) {
          for (const data3 of set3) {
            for (const data4 of set4) {
              for (const data5 of set5) {
                yield [data1, data2, data3, data4, data5];
              }
            }
          }
        }
      }
    },
  };
}

function map(data, fun) {
  return {
    *[Symbol.iterator]() {
      for (const datum of data) {
        const res = fun(datum);
        if (Array.isArray(res)) {
          for (const item of res) {
            yield item;
          }
        } else {
          yield res;
        }
      }
    },
  };
}
