const { Ast } = require('fion');

const Parser = require('./block');

exports.parse = (lexemes, visitors = {}) => {
  const funs = [];
  let fun = [];

  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];

    if (lexeme === 'fun') {
      if (fun.length) {
        if (visitors.module) {
          fun = visitors.module(fun);
        }
        fun[1] = Parser.parse(fun[1], visitors);
        funs.push(fun);
        fun = [];
      }

      fun.push(lexemes[i+1]);
      fun.push([]);
      i++;

      continue;
    }

    if (!fun[1]) {
      throw `Invalid module '${JSON.stringify(lexemes)}'`;
    }

    fun[1].push(lexeme);
  }

  if (visitors.module) {
    fun = visitors.module(fun);
  }
  fun[1] = Parser.parse(fun[1], visitors);
  funs.push(fun);

  return Ast.create(funs);
};
