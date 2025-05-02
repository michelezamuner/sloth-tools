const parse = (lexemes, context) => {
  if (context === undefined) {
    context = {
      lexemes: lexemes,
      current: 0,
      stop: false,
      base_scope: 0,
      scope: 0,
    };
  }
  const asts = [];
  while (!context.stop) {
    context.ast = {};
    exec('start', context);
    if (Object.keys(context.ast).length !== 0) {
      asts.push(context.ast);
    }
    if (context.current >= lexemes.length) {
      context.stop = true;
    }
    // console.log('ASTS', JSON.stringify(asts, null, 2));
  }

  return asts.reduce((acc, v) => {
    if (acc === undefined) {
      acc = v;
    } else if (acc.elem !== 'blk') {
      acc = {
        elem: 'blk',
        body: [acc, v],
      };
    } else {
      acc.body.push(v);
    }

    return acc;
  }, undefined);
};

const exec = (state, context) => {
  // console.log(state, JSON.stringify(context, null, 2));
  let lexeme = context.lexemes[context.current];
  if (lexeme === undefined) {
    return;
  }

  if (lexeme.scope !== undefined) {
    if (context.lexemes[context.current + 1] !== undefined) {
      context.current++;
    }

    context.base_scope = context.scope;
    context.scope = lexeme.scope;
    if (lexeme.scope < context.base_scope) {
      context.stop = true;

      return;
    }
  }

  states[state](context.lexemes[context.current], context);
};

const new_context = (context) => ({
  lexemes: context.lexemes,
  current: context.current,
  stop: false,
  base_scope: context.base_scope,
  scope: context.scope,
  ast: {},
});

const states = {
  'start': (lexeme, context) => {
    let isDef = false;

    switch (true) {
    case lexeme.includes && lexeme.includes('.'):
      exec('exp_enum', context);
      break;
    case lexeme.startsWith && lexeme.startsWith('::') && context.lexemes[context.current + 4] === '=':
      exec('mod', context);
      break;
    case context.lexemes[context.current + 1] && context.lexemes[context.current + 1] === '=':
      isDef = true;

      exec('def', context);
      break;
    case context.lexemes[context.current + 1] && context.lexemes[context.current + 1] === ':':
      exec('exp_fun', context);
      break;
    default:
      exec('exp_maybe_id', context);
      break;
    }

    if (!isDef) {
      context.stop = true;
    }
    if (context.lexemes[context.current + 1] && context.lexemes[context.current + 1].scope !== undefined) {
      context.current++;
    }
  },
  'exp_enum': (lexeme, context) => {
    switch (true) {
    default:
      context.ast.elem = 'exp';
      context.ast.var = 'enum';
      context.ast.type = { elem: 'type', var: 'id', id: lexeme.split('.')[0] };
      context.ast.body = { elem: 'cons', id: lexeme.split('.')[1] };
    }
  },
  'exp_maybe_id': (lexeme, context) => {
    const next = context.lexemes[context.current + 1];
    switch (true) {
    case next.scope <= context.base_scope:
      exec('exp_id', context);
      break;
    default:
      exec('exp_eval', context);
    }
  },
  'exp_id': (lexeme, context) => {
    switch (true) {
    case lexeme instanceof Object:
      context.ast = lexeme;

      break;
    default:
      context.ast.elem = 'exp';
      context.ast.var = 'id';
      context.ast.id = lexeme;
    }
  },
  'exp_eval': (lexeme, context) => {
    switch (true) {
    case lexeme instanceof Object:
      context.ast = { elem: 'exp', fun: lexeme };

      break;
    default:
      context.ast = { fun: { elem: 'exp', var: 'id', id: lexeme } };

      break;
    }

    context.ast.elem = 'exp';
    context.ast.var = 'eval';
    context.ast.args = [];

    if (!context.lexemes[context.current + 1].scope) {
      context.scope += 2;
    }
    context.current++;
    exec('exp_eval_args', context);
  },
  'exp_eval_args': (lexeme, context) => {
    let ast = {};

    switch (true) {
    case context.lexemes[context.current + 1].scope && context.lexemes[context.current + 1].scope > context.scope: {
      const sub_context = new_context(context);
      ast = parse(sub_context.lexemes, sub_context);
      context.current = sub_context.current;

      break;
    }
    case lexeme instanceof Object:
      ast = lexeme;

      break;
    default: {
      const sub_context = new_context(context);
      sub_context.lexemes = [lexeme, { scope: -1 }];
      sub_context.current = 0;
      ast = parse(sub_context.lexemes, sub_context);
    }
    }

    context.ast.args.push(ast);

    if (context.lexemes[context.current + 1] && (!context.lexemes[context.current + 1].scope || context.lexemes[context.current + 1].scope === context.scope)) {
      context.current++;
      exec('exp_eval_args', context);
    }
  },
  'exp_fun': (lexeme, context) => {
    switch (true) {
    case context.ast.elem === undefined:
      context.ast.elem = 'exp';
      context.ast.var = 'fun';
      context.ast.args = [{ elem: 'pat', var: 'id', id: lexeme }];

      context.current += 2;
      exec('exp_fun', context);
      break;
    case context.ast.args[context.ast.args.length - 1].type === undefined:
      context.ast.args[context.ast.args.length - 1].type = { elem: 'type', var: 'id', id: lexeme };

      context.current++;
      exec('exp_fun', context);
      break;
    case context.ast.args[context.ast.args.length - 1].type !== undefined && lexeme !== '->' && context.ast.body === undefined: {
      context.ast.args.push({ elem: 'pat', var: 'id', id: lexeme });

      context.current += 2;
      exec('exp_fun', context);
      break;
    }
    case lexeme === '->': {
      context.ast.body = {};

      if (!context.lexemes[context.current + 1].scope) {
        context.scope += 2;
      }
      context.current++;
      exec('exp_fun', context);
      break;
    }
    default: {
      const sub_context = new_context(context);
      const sub_ast = parse(sub_context.lexemes, sub_context);
      context.ast.body = sub_ast;
      context.current = sub_context.current;
    }
    }
  },
  'def': (lexeme, context) => {
    switch (true) {
    case context.ast.id === undefined:
      context.ast.elem = 'def';
      if (lexeme.startsWith('::')) {
        context.ast.id = lexeme.substr(2);
        context.ast.vis = 'pub';
      } else {
        context.ast.id = lexeme;
        context.ast.vis = 'priv';
      }

      context.current += 2;
      exec('def', context);
      break;
    case context.ast.id !== context.ast.id.toUpperCase():
      context.ast.var = 'ref';

      exec('def_ref', context);
      break;
    default:
      context.ast.body = [];
      context.ast.var = 'enum';

      exec('def_enum_cons', context);
    }
  },
  'def_enum_cons': (lexeme, context) => {
    context.ast.body.push({ elem: 'cons', id: lexeme });

    if (context.lexemes[context.current + 1] === '|') {
      context.current += 2;
      exec('def_enum_cons', context);
    }
  },
  'def_ref': (lexeme, context) => {
    switch (true) {
    default: {
      const sub_context = new_context(context);
      const sub_ast = parse(sub_context.lexemes, sub_context);
      context.ast.body = sub_ast;
      context.current = sub_context.current;
    }
    }
  },
  'mod': (lexeme, context) => {
    switch (true) {
    case context.ast.elem !== 'mod':
      context.ast.elem = 'mod',
      context.ast.id = lexeme.substr(2);
      context.ast.body = [];

      context.scope = context.lexemes[context.current + 2].scope;
      context.base_scope = context.scope;
      context.current += 2;
      exec('mod', context);
      break;
    default: {
      const sub_context = new_context(context);
      let sub_ast = parse(sub_context.lexemes, sub_context);
      if (sub_ast.elem !== 'blk') {
        sub_ast = { body: [sub_ast] };
      }
      context.ast.body = sub_ast.body;
      context.current = sub_context.current;

      context.current++;
      exec('mod', context);
    }
    }
  },
};

exports.parse = parse;
