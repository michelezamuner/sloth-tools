const Normalizer = require('../../../../src/frontends/enlil/normalizer/alias');
const Lexer = require('../../../../src/frontends/enlil/lexer');
// const { mix } = require('../../../utils');
// const { defs } = require('../utils');

// const partials = () => [
//   {
//     code: 'Process',
//     expLex: ['Process'],
//   },
//   {
//     code: 'sys::Exit',
//     expLex: ['sys', '::', 'Exit'],
//   },
// ];
// const aliases = () => mix(
//   partials(),
//   partials(),
//   defs(),
// )
//   .flatMap(
//     ([p1, p2, d]) => [
//       {
//         code: `
//         alias core::sys::${p1.code};
//         ${d.code}
//         `,
//         expLex: ['alias', 'core', '::', 'sys', '::'].concat(p1.expLex).concat(d.expLex),
//       },
//       {
//         code: `
//         alias core::sys::${p1.code};
//         alias core::sys::${p2.code}
//         ${d.code}
//         `,
//         expLex: ['alias', 'core', '::', 'sys', '::'].concat(p1.expected),
//       },
//     ],
//   )
//   .filter((value, index, self) => self.findIndex(v => v.code === value.code) === index);

const complete_aliases = () => [
  // enum T { A }
  {
    code: 'alias m::n::U; enum T { A }',
    expected: ['enum', 'T', '{', 'A', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; enum T { A }',
    expected: ['enum', 'T', '{', 'A', '}'],
  },
  {
    code: 'alias m::n::U; pub enum T { A }',
    expected: ['pub', 'enum', 'T', '{', 'A', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub enum T { A }',
    expected: ['pub', 'enum', 'T', '{', 'A', '}'],
  },
  // const a = b;
  {
    code: 'alias m::n::U; const a = b;',
    expected: ['const', 'a', '=', 'b', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = b;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = b;',
    expected: ['pub', 'const', 'a', '=', 'b', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = b;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  // const a = U::A;
  {
    code: 'alias m::n::U; const a = U::A;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = U::A;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = U::A;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = U::A;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  // const a = f(b);
  {
    code: 'alias m::n::U; const a = f(b);',
    expected: ['const', 'a', '=', 'f', '(', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, b);
  {
    code: 'alias m::n::U; const a = f(b, b);',
    expected: ['const', 'a', '=', 'f', '(', 'b', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(b, b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(b, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'b', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(b, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, U::A);
  {
    code: 'alias m::n::U; const a = f(b, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(b, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(b, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(b, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(b, f(b));
  {
    code: 'alias m::n::U; const a = f(b, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'b', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(b, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(b, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'b', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(b, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(b, |a: U| -> U { b });
  {
    code: 'alias m::n::U; const a = f(b, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(b, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(b, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(b, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(U::A);
  {
    code: 'alias m::n::U; const a = f(U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, b);
  {
    code: 'alias m::n::U; const a = f(U::A, b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(U::A, b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(U::A, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(U::A, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(U::A, U::A);
  {
    code: 'alias m::n::U; const a = f(U::A, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(U::A, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(U::A, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(U::A, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, f(b));
  {
    code: 'alias m::n::U; const a = f(U::A, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(U::A, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(U::A, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(U::A, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(U::A, |a: U| -> U { b });
  {
    code: 'alias m::n::U; const a = f(U::A, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(U::A, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(U::A, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(U::A, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(f(b), b);
  {
    code: 'alias m::n::U; const a = f(f(b), b);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'b', ')',  ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(f(b), b);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(f(b), b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'b', ')',  ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(f(b), b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(f(b), U::A);
  {
    code: 'alias m::n::U; const a = f(f(b), U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(f(b), U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(f(b), U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(f(b), U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(f(b), f(b));
  {
    code: 'alias m::n::U; const a = f(f(b), f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'b', ')', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(f(b), f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(f(b), f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'b', ')', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(f(b), f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(f(b), |a: U| -> U { b });
  {
    code: 'alias m::n::U; const a = f(f(b), |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'b', ')',  ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(f(b), |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(f(b), |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(f(b), |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, b);
  {
    code: 'alias m::n::U; const a = f(|a: U| -> U { b }, b);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(|a: U| -> U { b }, b);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(|a: U| -> U { b }, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(|a: U| -> U { b }, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, U::A);
  {
    code: 'alias m::n::U; const a = f(|a: U| -> U { b }, U::A);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(|a: U| -> U { b }, U::A);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(|a: U| -> U { b }, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(|a: U| -> U { b }, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, f(b));
  {
    code: 'alias m::n::U; const a = f(|a: U| -> U { b }, f(b));',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(|a: U| -> U { b }, f(b));',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(|a: U| -> U { b }, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', 'f', '(', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(|a: U| -> U { b }, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, |a: U| -> U { b });
  {
    code: 'alias m::n::U; const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; pub const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // fn f(a: U) -> U { b }
  {
    code: 'alias m::n::U; fn f(a: U) -> U { b }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; fn f(a: U) -> U { b }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  {
    code: 'alias m::n::U; pub fn f(a: U) -> U { b }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub fn f(a: U) -> U { b }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  // fn f(a: U) -> U { U::A }
  {
    code: 'alias m::n::U; fn f(a: U) -> U { U::A }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; fn f(a: U) -> U { U::A }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  {
    code: 'alias m::n::U; pub fn f(a: U) -> U { U::A }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub fn f(a: U) -> U { U::A }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  // fn f(a: U) -> U { f(b) }
  {
    code: 'alias m::n::U; fn f(a: U) -> U { f(b) }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'b', ')', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; fn f(a: U) -> U { f(b) }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  {
    code: 'alias m::n::U; pub fn f(a: U) -> U { f(b) }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'b', ')', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub fn f(a: U) -> U { f(b) }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  // fn f(a: U) -> U { |a: U| -> U { b } }
  {
    code: 'alias m::n::U; fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
  {
    code: 'alias m::n::U; pub fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'b', '}', '}'],
  },
  {
    code: 'alias m::n::U; alias m::n::b; pub fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
];

const partial_aliases = () => [
  // enum T { A }
  {
    code: 'alias m::n; enum T { A }',
    expected: ['enum', 'T', '{', 'A', '}'],
  },
  {
    code: 'alias m::n; pub enum T { A }',
    expected: ['pub', 'enum', 'T', '{', 'A', '}'],
  },
  // const a = b;
  {
    code: 'alias m::n; const a = n::b;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  {
    code: 'alias m::n; pub const a = n::b;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  // const a = U::A;
  {
    code: 'alias m::n; const a = n::U::A;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  {
    code: 'alias m::n; pub const a = n::U::A;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  // const a = f(b);
  {
    code: 'alias m::n; const a = f(n::b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, b);
  {
    code: 'alias m::n; const a = f(n::b, n::b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::b, n::b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, U::A);
  {
    code: 'alias m::n; const a = f(n::b, n::U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::b, n::U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(b, f(b));
  {
    code: 'alias m::n; const a = f(n::b, f(n::b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::b, f(n::b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(b, |a: U| -> U { b });
  {
    code: 'alias m::n; const a = f(n::b, |a: n::U| -> n::U { n::b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::b, |a: n::U| -> n::U { n::b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(U::A);
  {
    code: 'alias m::n; const a = f(n::U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, b);
  {
    code: 'alias m::n; const a = f(n::U::A, n::b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::U::A, n::b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(U::A, U::A);
  {
    code: 'alias m::n; const a = f(n::U::A, n::U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::U::A, n::U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, f(b));
  {
    code: 'alias m::n; const a = f(n::U::A, f(n::b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::U::A, f(n::b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(U::A, |a: U| -> U { b });
  {
    code: 'alias m::n; const a = f(n::U::A, |a: n::U| -> n::U { n::b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(n::U::A, |a: n::U| -> n::U { n::b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(f(b), b);
  {
    code: 'alias m::n; const a = f(f(n::b), n::b);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(f(n::b), n::b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(f(b), U::A);
  {
    code: 'alias m::n; const a = f(f(n::b), n::U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(f(n::b), n::U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(f(b), f(b));
  {
    code: 'alias m::n; const a = f(f(n::b), f(n::b));',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(f(n::b), f(n::b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(f(b), |a: U| -> U { b });
  {
    code: 'alias m::n; const a = f(f(n::b), |a: n::U| -> n::U { n::b });',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(f(n::b), |a: n::U| -> n::U { n::b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, b);
  {
    code: 'alias m::n; const a = f(|a: n::U| -> n::U { n::b }, n::b);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(|a: n::U| -> n::U { n::b }, n::b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, U::A);
  {
    code: 'alias m::n; const a = f(|a: n::U| -> n::U { n::b }, n::U::A);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(|a: n::U| -> n::U { n::b }, n::U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, f(b));
  {
    code: 'alias m::n; const a = f(|a: n::U| -> n::U { n::b }, f(n::b));',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(|a: n::U| -> n::U { n::b }, f(n::b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, |a: U| -> U { b });
  {
    code: 'alias m::n; const a = f(|a: n::U| -> n::U { n::b }, |a: n::U| -> n::U { n::b });',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n; pub const a = f(|a: n::U| -> n::U { n::b }, |a: n::U| -> n::U { n::b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // fn f(a: U) -> U { b }
  {
    code: 'alias m::n; fn f(a: n::U) -> n::U { n::b }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  {
    code: 'alias m::n; pub fn f(a: n::U) -> n::U { n::b }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  // fn f(a: U) -> U { U::A }
  {
    code: 'alias m::n; fn f(a: n::U) -> n::U { n::U::A }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  {
    code: 'alias m::n; pub fn f(a: n::U) -> n::U { n::U::A }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  // fn f(a: U) -> U { f(b) }
  {
    code: 'alias m::n; fn f(a: n::U) -> n::U { f(n::b) }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  {
    code: 'alias m::n; pub fn f(a: n::U) -> n::U { f(n::b) }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  // fn f(a: U) -> U { |a: U| -> U { b } }
  {
    code: 'alias m::n; fn f(a: n::U) -> n::U { |a: n::U| -> n::U { n::b } }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
  {
    code: 'alias m::n; pub fn f(a: n::U) -> n::U { |a: n::U| -> n::U { n::b } }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
];

const grouped_aliases = () => [
  // enum T { A }
  {
    code: 'alias m::n::{U, b}; enum T { A }',
    expected: ['enum', 'T', '{', 'A', '}'],
  },
  {
    code: 'alias m::n::{U, b}; pub enum T { A }',
    expected: ['pub', 'enum', 'T', '{', 'A', '}'],
  },
  // const a = b;
  {
    code: 'alias m::n::{U, b}; const a = b;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = b;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'b', ';'],
  },
  // const a = U::A;
  {
    code: 'alias m::n::{U, b}; const a = U::A;',
    expected: ['const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = U::A;',
    expected: ['pub', 'const', 'a', '=', 'm', '::', 'n', '::', 'U', '::', 'A', ';'],
  },
  // const a = f(b);
  {
    code: 'alias m::n::{U, b}; const a = f(b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, b);
  {
    code: 'alias m::n::{U, b}; const a = f(b, b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(b, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(b, U::A);
  {
    code: 'alias m::n::{U, b}; const a = f(b, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(b, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(b, f(b));
  {
    code: 'alias m::n::{U, b}; const a = f(b, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(b, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(b, |a: U| -> U { b });
  {
    code: 'alias m::n::{U, b}; const a = f(b, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(b, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'b', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(U::A);
  {
    code: 'alias m::n::{U, b}; const a = f(U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, b);
  {
    code: 'alias m::n::{U, b}; const a = f(U::A, b);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(U::A, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(U::A, U::A);
  {
    code: 'alias m::n::{U, b}; const a = f(U::A, U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(U::A, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(U::A, f(b));
  {
    code: 'alias m::n::{U, b}; const a = f(U::A, f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(U::A, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(U::A, |a: U| -> U { b });
  {
    code: 'alias m::n::{U, b}; const a = f(U::A, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(U::A, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'm', '::', 'n', '::', 'U', '::', 'A', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(f(b), b);
  {
    code: 'alias m::n::{U, b}; const a = f(f(b), b);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(f(b), b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(f(b), U::A);
  {
    code: 'alias m::n::{U, b}; const a = f(f(b), U::A);',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(f(b), U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')',  ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(f(b), f(b));
  {
    code: 'alias m::n::{U, b}; const a = f(f(b), f(b));',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(f(b), f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(f(b), |a: U| -> U { b });
  {
    code: 'alias m::n::{U, b}; const a = f(f(b), |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(f(b), |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, b);
  {
    code: 'alias m::n::{U, b}; const a = f(|a: U| -> U { b }, b);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(|a: U| -> U { b }, b);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'b', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, U::A);
  {
    code: 'alias m::n::{U, b}; const a = f(|a: U| -> U { b }, U::A);',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(|a: U| -> U { b }, U::A);',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'm', '::', 'n', '::', 'U', '::', 'A', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, f(b));
  {
    code: 'alias m::n::{U, b}; const a = f(|a: U| -> U { b }, f(b));',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(|a: U| -> U { b }, f(b));',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', 'f', '(', 'm', '::', 'n', '::', 'b', ')', ')', ';'],
  },
  // const a = f(|a: U| -> U { b }, |a: U| -> U { b });
  {
    code: 'alias m::n::{U, b}; const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  {
    code: 'alias m::n::{U, b}; pub const a = f(|a: U| -> U { b }, |a: U| -> U { b });',
    expected: ['pub', 'const', 'a', '=', 'f', '(', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ',', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', ')', ';'],
  },
  // fn f(a: U) -> U { b }
  {
    code: 'alias m::n::{U, b}; fn f(a: U) -> U { b }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  {
    code: 'alias m::n::{U, b}; pub fn f(a: U) -> U { b }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}'],
  },
  // fn f(a: U) -> U { U::A }
  {
    code: 'alias m::n::{U, b}; fn f(a: U) -> U { U::A }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  {
    code: 'alias m::n::{U, b}; pub fn f(a: U) -> U { U::A }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'U', '::', 'A', '}'],
  },
  // fn f(a: U) -> U { f(b) }
  {
    code: 'alias m::n::{U, b}; fn f(a: U) -> U { f(b) }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  {
    code: 'alias m::n::{U, b}; pub fn f(a: U) -> U { f(b) }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', 'f', '(', 'm', '::', 'n', '::', 'b', ')', '}'],
  },
  // fn f(a: U) -> U { |a: U| -> U { b } }
  {
    code: 'alias m::n::{U, b}; fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
  {
    code: 'alias m::n::{U, b}; pub fn f(a: U) -> U { |a: U| -> U { b } }',
    expected: ['pub', 'fn', 'f', '(', 'a', ':', 'm', '::', 'n', '::', 'U', ')', '->', 'm', '::', 'n', '::', 'U', '{', '|', 'a', ':', 'm', '::', 'n', '::', 'U', '|', '->', 'm', '::', 'n', '::', 'U', '{', 'm', '::', 'n', '::', 'b', '}', '}'],
  },
];

describe('enlil alias normalizer', () => {
  it.each(complete_aliases())('parses complete alias `$code`', ({ code, expected }) => {
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual(expected);
  });

  it.each(partial_aliases())('parses partial alias `$code`', ({ code, expected }) => {
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual(expected);
  });

  it.each(grouped_aliases())('parses grouped alias `$code`', ({ code, expected }) => {
    const rawLexemes = Lexer.parse(code);

    const lexemes = Normalizer.parse(rawLexemes, {});

    expect(lexemes).toStrictEqual(expected);
  });
});
