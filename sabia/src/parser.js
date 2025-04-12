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
    if (lexeme.scope >= context.scope) {
      context.target_scope === undefined;
      context.scope = lexeme.scope;
    } else {
      context.target_scope = lexeme.scope;
      context.scope -= 2;
    }

    if (context.lexemes[context.current + 1] !== undefined) {
      context.current++;
    }

    // End of block
    if (lexeme.scope < context.base_scope) {
      context.stop = true;

      return;
    }

    // New line
    else if (lexeme.scope === context.base_scope) {
      return;
    }
  }

  states[state](context.lexemes[context.current], context);
};

const exec_next = (state, context) => {
  context.current++;
  exec(state, context);
};

const new_context = (context, scope) => ({
  lexemes: context.lexemes,
  current: context.current,
  stop: false,
  base_scope: scope !== undefined ? scope : context.scope,
  scope: scope !== undefined ? scope : context.scope,
  target_scope: undefined,
  ast: {},
});

const states = {
  'start': (lexeme, context) => {
    switch (true) {
    case context.target_scope !== undefined && context.scope > context.target_scope:
      context.stop = true;
      break;
    default:
      exec('exp_start', context);
    }
  },
  'end': (lexeme, context) => {
    switch (true) {
    case !lexeme.scope:
      context.current++;
      break;
    }
  },
  'exp_start': (lexeme, context) => {
    switch (true) {
    case lexeme instanceof Object:
      context.ast = lexeme;

      break;
    case lexeme.includes('.'):
      context.ast.elem = 'exp';
      context.ast.var = 'enum';
      context.ast.type = { elem: 'type', var: 'id', id: lexeme.split('.')[0] };
      context.ast.body = { elem: 'cons', id: lexeme.split('.')[1] };

      break;
    case lexeme.startsWith('::'):
      context.ast.id = lexeme;
      exec('maybe_mod', context);

      return;

    default:
      context.ast.elem = 'exp';
      context.ast.var = 'id';
      context.ast.id = lexeme;
    }

    exec_next('exp_next', context);
  },
  'exp_next': (lexeme, context) => {
    switch (true) {
    case lexeme === '=':
      exec('def', context);

      break;
    case lexeme === ':':
      exec('exp_fun', context);

      break;
    default:
      exec('exp_eval', context);
    }
  },
  'exp_eval': (lexeme, context) => {
    switch (true) {
    case context.ast.id !== undefined:
      context.ast.fun = { elem: 'exp', var: 'id', id: context.ast.id };
      delete context.ast.id;

      break;
    default:
      context.ast = { elem: 'exp', fun: context.ast };
    }

    context.ast.var = 'eval';
    context.ast.args = [];

    exec('exp_eval_args', context);
  },
  'exp_eval_args': (lexeme, context) => {
    const sub_context = new_context(context, context.scope + 2);

    switch (true) {
    case lexeme instanceof Object:
      sub_context.ast = lexeme;

      break;
    case lexeme.includes('.'):
      sub_context.ast.elem = 'exp';
      sub_context.ast.var = 'enum';
      sub_context.ast.type = { elem: 'type', var: 'id', id: lexeme.split('.')[0] };
      sub_context.ast.body = { elem: 'cons', id: lexeme.split('.')[1] };

      break;
    case lexeme === '->':
      exec('exp_fun', context);

      return;
    default:
      sub_context.ast.elem = 'exp';
      sub_context.ast.var = 'id';
      sub_context.ast.id = lexeme;
    }

    context.ast.args.push(sub_context.ast);
    if (sub_context.target_scope !== undefined) {
      context.target_scope = sub_context.target_scope;
    }

    exec_next('exp_eval_args', context);
  },
  'exp_fun': (lexeme, context) => {
    switch (true) {
    case lexeme === ':' && context.ast.var !== 'fun':
      context.ast.var = 'fun';
      context.ast.args = [{ elem: 'pat', var: 'id', id: context.ast.id }];
      delete context.ast.id;

      exec_next('exp_fun', context);
      break;
    case lexeme === ':':
      exec_next('exp_fun', context);
      break;
    case context.ast.args[context.ast.args.length - 1].type === undefined:
      context.ast.args[context.ast.args.length - 1].type = { elem: 'type', var: 'id', id: lexeme };

      exec_next('exp_fun', context);
      break;
    case context.ast.args[context.ast.args.length - 1].type !== undefined && lexeme !== '->' && context.ast.body === undefined: {
      context.ast.args.push({ elem: 'pat', var: 'id', id: lexeme });

      exec_next('exp_fun', context);
      break;
    }
    case lexeme === '->': {
      context.ast.body = {};

      exec_next('exp_fun', context);
      break;
    }
    default: {
      const scope = lexeme.scope !== undefined ? context.scope : context.scope + 2;
      const sub_context = new_context(context, scope);
      const sub_ast = parse(sub_context.lexemes, sub_context);
      context.ast.body = sub_ast;
      context.current = sub_context.current;
      if (sub_context.target_scope !== undefined) {
        context.target_scope = sub_context.target_scope;
      }
    }
    }
  },
  'def': (lexeme, context) => {
    context.ast.vis = 'priv';
    if (context.ast.id.startsWith('::')) {
      context.ast.id = context.ast.id.substr(2);
      context.ast.vis = 'pub';
    }

    switch (true) {
    case typeof context.lexemes[context.current + 1] === 'string' && context.lexemes[context.current + 1].startsWith('::'):
      context.ast.elem = 'def';
      exec_next('def_ext', context);

      break;
    case context.ast.id !== context.ast.id.toUpperCase():
      context.ast.elem = 'def';
      context.ast.var = 'ref';
      exec_next('def_ref', context);

      break;
    default:
      context.ast.elem = 'def';
      context.ast.body = [];
      exec('def_enum', context);
    }
  },
  'def_enum': (lexeme, context) => {
    context.ast.var = 'enum';
    exec_next('def_enum_cons', context);
  },
  'def_enum_cons': (lexeme, context) => {
    context.ast.body.push({ elem: 'cons', id: lexeme });
    exec_next('def_enum_sep', context);
  },
  'def_enum_sep': (lexeme, context) => {
    switch (true) {
    case lexeme !== '|':
      exec('def', context);

      break;
    default:
      exec_next('def_enum_cons', context);
    }
  },
  'def_ext': (lexeme, context) => {
    switch (true) {
    default:
      context.ast.var = 'ref';
      context.ast.body = { elem: 'ext', id: lexeme };
    }

    exec('end', context);
  },
  'def_ref': (lexeme, context) => {
    switch (true) {
    default: {
      const sub_context = new_context(context, context.scope + 2);
      const sub_ast = parse(sub_context.lexemes, sub_context);
      context.ast.body = sub_ast;
      context.current = sub_context.current;
      if (sub_context.target_scope !== undefined) {
        context.target_scope = sub_context.target_scope;
      }
    }
    }
  },
  'maybe_mod': (lexeme, context) => {
    switch (true) {
    case context.lexemes[context.current + 1].scope > context.scope:
      exec('mod', context);
      break;
    default:
      exec_next('def', context);
    }
  },
  'mod': (lexeme, context) => {
    switch (true) {
    case context.ast.elem !== 'mod':
      context.ast.elem = 'mod',
      context.ast.body = [];

      exec_next('mod', context);
      break;
    default: {
      const sub_context = new_context(context, context.scope);
      let sub_ast = parse(sub_context.lexemes, sub_context);
      if (sub_ast.elem !== 'blk') {
        sub_ast = { body: [sub_ast] };
      }
      context.ast.body = sub_ast.body;
      context.current = sub_context.current;
      if (sub_context.target_scope !== undefined) {
        context.target_scope = sub_context.target_scope;
      }

      exec_next('mod', context);
    }
    }
  },
};

exports.parse = parse;
