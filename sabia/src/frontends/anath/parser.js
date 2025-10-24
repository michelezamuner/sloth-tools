const parse = lexemes => {
  const context = {
    current: 0,
    ast: [{}],
    state: 'start',
    return: ['end'],
  };
  while (context.state !== 'stop') {
    context.state = states[context.state](
      lexemes[context.current],
      context,
      lexemes[context.current + 1],
    );
  }

  return context.ast.pop();
};

exports.parse = parse;

const states = {
  start: (lexeme, context, next) => {
    if (lexeme === '(') {
      return 'group';
    }

    if (lexeme === '::') {
      context.ast.at(-1).vis = 'pub';
      context.current++; // def name

      return 'start';
    }

    if (next === '=' || next === '{') {
      return 'def';
    }

    if (isCapital(lexeme)) {
      return 'cons?';
    }

    if (next === ':') {
      return 'fun';
    }

    if (next === '::') {
      context.return.push('start');

      return 'mod';
    }

    if (context.ast.at(-1).elem === 'mod') {
      lexeme = context.ast.at(-1).mod + lexeme;
    }

    context.ast[context.ast.length - 1] = {
      elem: 'exp',
      var: 'ref',
      name: lexeme,
    };

    return context.return.pop();
  },
  end: (lexeme, context, next) => {
    if (next) {
      context.return.push('end');

      return 'eval';
    }

    return 'stop';
  },
  group: (lexeme, context, next) => {
    if (lexeme === '(') {
      context.current++; // group start
      context.ast.push({});
      context.return.push('group');

      return 'start';
    }

    if (next === ')') {
      const ast = context.ast.pop();
      context.ast[context.ast.length - 1] = ast;
      context.current++; // group end

      return context.return.pop();
    }

    context.return.push('group');

    return 'eval';
  },
  'cons?': (lexeme, context) => {
    if (lexeme === '::') {
      return 'cons';
    }

    if (lexeme === '=') {
      return 'def';
    }

    context.return.push('cons?');

    return 'type';
  },
  cons: (lexeme, context) => {
    if (lexeme === '::') {
      context.ast[context.ast.length - 1] = {
        elem: 'exp',
        var: 'cons',
        type: context.ast.at(-1),
        name: null,
      };
      context.current++; // cons name

      return 'cons';
    }

    context.ast.at(-1).name = lexeme;

    return context.return.pop();
  },
  type: (lexeme, context, next) => {
    if (lexeme === '<') {
      context.ast.push({});
      context.current++; // type parameter
      context.return.push('type');

      return 'type';
    }

    if (lexeme === ',') {
      const ast = context.ast.pop();
      context.ast.at(-1).params.push(ast);

      context.ast.push({});
      context.current++; // type parameter
      context.return.push('type');

      return 'type';
    }

    if (lexeme === '>') {
      const ast = context.ast.pop();
      context.ast.at(-1).params.push(ast);
      context.current++; // type cannot be alone

      return context.return.pop();
    }

    if (!isCapital(lexeme)) {
      context.return.push('type');

      return 'mod';
    }

    if (context.ast.at(-1).elem === 'mod') {
      lexeme = context.ast.at(-1).mod + lexeme;
    }

    const vis = context.ast.at(-1).vis;
    context.ast[context.ast.length - 1] = {
      elem: 'type',
      name: lexeme,
      params: [],
    };
    if (vis) {
      context.ast.at(-1).vis = vis;
    }

    context.current++; // type cannot be alone
    if (next === '<') {
      return 'type';
    }

    return context.return.pop();
  },
  mod: (lexeme, context, next) => {
    if (
      lexeme !== '::' &&
      (next !== '::' || isCapital(lexeme))
    ) {
      return context.return.pop();
    }

    if (!context.ast.at(-1).elem) {
      context.ast[context.ast.length - 1] = {
        elem: 'mod',
        mod: '',
      };
    }

    context.ast.at(-1).mod += lexeme;
    context.current++; // next mod element

    return 'mod';
  },
  fun: (lexeme, context) => {
    if (lexeme === ':') {
      context.current++; // arg type
      context.ast.push({});
      context.return.push('fun');

      return 'type';
    }

    if (lexeme === '->') {
      const ast = context.ast.pop();
      context.ast.at(-1).type.params.push(ast);
      context.ast.at(-1).arg.type = ast;
      context.current++; // ret type
      context.ast.push({});
      context.return.push('fun');

      return 'type';
    }

    if (!context.ast.at(-1).elem) {
      context.ast[context.ast.length - 1] = {
        elem: 'exp',
        var: 'fun',
        type: {
          elem: 'type',
          name: 'core::lang::Fun',
          params: [],
        },
        arg: {
          elem: 'def',
          var: 'arg',
          name: lexeme,
          type: null,
        },
        body: null,
      };
      context.current++; // fun start

      return 'fun';
    }

    const ast = context.ast.pop();

    if (context.ast.at(-1).type.params.length === 1) {
      context.ast.at(-1).type.params.push(ast);
      context.ast.push({});
      context.return.push('fun');

      return 'start';
    }

    context.ast.at(-1).body = ast;

    return context.return.pop();
  },
  eval: (lexeme, context) => {
    if (context.ast.length > 1 && context.ast.at(-2).var === 'eval') {
      const ast = context.ast.pop();
      context.ast.at(-1).arg = ast;

      return context.return.pop();
    }

    context.ast[context.ast.length - 1] = {
      elem: 'exp',
      var: 'eval',
      fun: context.ast.pop(),
      arg: null,
    };
    context.current++; // eval arg
    context.ast.push({});
    context.return.push('eval');

    return 'start';
  },
  def: (lexeme, context, next) => {
    if (next === '{') {
      return 'moddef';
    }

    if (context.ast.at(-1).elem === 'type' || isCapital(lexeme)) {
      return 'typedef';
    }

    return 'refdef';
  },
  typedef: (lexeme, context) => {
    if (context.ast.at(-1).elem === 'type' && (!context.ast.at(-2) || context.ast.at(-2).elem !== 'cons')) {
      context.ast[context.ast.length - 1] = {
        elem: 'def',
        var: 'type',
        name: context.ast.at(-1).name,
        params: context.ast.at(-1).params,
        vis: context.ast.at(-1).vis || 'priv',
        body: [],
      };

      return 'typedef';
    }

    if (lexeme === '=') {
      context.ast.push({
        elem: 'cons',
        name: null,
        arg: null,
      });
      context.current++; // cons definition

      return 'typedef';
    }

    if (lexeme === '|') {
      if (context.ast.at(-1).elem === 'type') {
        const type = context.ast.pop();
        context.ast.at(-1).arg = type;
      }

      const ast = context.ast.pop();
      context.ast.at(-1).body.push(ast);

      context.current++; // cons definition
      context.ast.push({
        elem: 'cons',
        name: null,
        arg: null,
      });

      return 'typedef';
    }

    if (!context.ast.at(-1).elem) {
      context.ast[context.ast.length - 1] = {
        elem: 'def',
        var: 'type',
        name: lexeme,
        params: [],
        vis: context.ast.at(-1).vis || 'priv',
        body: [],
      };
      context.current++; // type definition

      return 'typedef';
    }

    if (context.ast.at(-1).elem === 'param') {
      context.ast.at(-1).name = lexeme;
      context.current++; // params

      return 'typedef';
    }

    if (context.ast.at(-1).elem === 'cons' && !context.ast.at(-1).name) {
      context.ast.at(-1).name = lexeme;
      context.current++; // cons definition

      return 'typedef';
    }

    if (context.ast.at(-1).elem === 'type') {
      const type = context.ast.pop();
      context.ast.at(-1).arg = type;

      return 'typedef';
    }

    if (lexeme === ';') {
      const ast = context.ast.pop();
      context.ast.at(-1).body.push(ast);

      return context.return.pop();
    }

    context.ast.push({});
    context.return.push('typedef');

    return 'type';
  },
  refdef: (lexeme, context, next) => {
    if (!context.ast.at(-1).elem) {
      context.ast[context.ast.length - 1] = {
        elem: 'def',
        var: 'ref',
        name: lexeme,
        vis: context.ast.at(-1).vis || 'priv',
        body: null,
      };

      context.current++; // def body

      return 'refdef';
    }

    if (lexeme === '=') {
      context.ast.push({});
      context.current++; // body start
      context.return.push('refdef');

      return 'start';
    }

    if (next === ';') {
      const ast = context.ast.pop();
      context.ast.at(-1).body = ast;
      context.current++; // body end

      return context.return.pop();
    }

    context.return.push('refdef');

    return 'eval';
  },
  moddef: (lexeme, context, next) => {
    if (!context.ast.at(-1).elem) {
      context.ast[context.ast.length - 1] = {
        elem: 'def',
        var: 'mod',
        name: lexeme,
        vis: context.ast.at(-1).vis || 'priv',
        body: []
      };
      context.current++; // mod definition

      return 'moddef';
    }

    if (lexeme === '{') {
      context.ast.push({});
      context.current++; // mod definition
      context.return.push('moddef');

      return 'start';
    }

    if (next === '}') {
      const ast = context.ast.pop();
      context.ast.at(-1).body.push(ast);
      context.current++; // mod definition

      return context.return.pop();
    }

    const ast = context.ast.pop();
    context.ast.at(-1).body.push(ast);
    context.ast.push({});
    context.current++; // mod definition
    context.return.push('moddef');

    return 'start';
  },
};

function isCapital(string) {
  return string.charAt(0) === string.charAt(0).toUpperCase();
}
