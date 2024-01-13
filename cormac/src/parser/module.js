const { Ast } = require('fion');

const Parser = require('./block');

exports.parse = lexemes => {
  const funs = [];
  let fun = [];

  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];

    if (lexeme === 'fun') {
      if (fun[1]) {
        fun[1] = Parser.parse(fun[1]);
        funs.push(fun);
        fun = [];
      }

      continue;
    }

    if (fun.length === 0) {
      fun.push(lexeme);
      fun.push([]);
    } else {
      fun[1].push(lexeme);
    }
  }

  fun[1] = Parser.parse(fun[1]);
  funs.push(fun);

  return Ast.create(funs);
};
