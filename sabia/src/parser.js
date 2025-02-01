exports.parse = ast => parse(ast);

const parse = (lexemes, context) => {
  if (context === undefined) {
    context = {
      lexemes: lexemes,
      start: 0,
      stop: false,
      base_scope: 0,
      scope: 0,
    };
  }
  const asts = [];
  for (context.i = context.start; !context.stop;) {
    parse_elem(context);
    if (Object.keys(context.ast).length !== 0) {
      asts.push(context.ast);
    }
    if (context.i >= lexemes.length) {
      context.stop = true;
    }
  }

  return asts.reduce((acc, v) => {
    if (acc === undefined) {
      acc = v;
    } else if (acc.elem !== 'seq') {
      acc = {
        elem: 'seq',
        body: [acc, v],
      };
    } else {
      acc.body.push(v);
    }

    return acc;
  }, undefined);
};

const parse_elem = context => {
  context.state = 'start';
  context.stop_elem = false;
  context.ast = {};
  for (; !context.stop_elem; context.i++) {
    // console.log(context);
    states[context.state](context);
    if (context.i >= context.lexemes.length - 1) {
      context.stop_elem = true;
    }
  }
};

const states = {
  'start': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    case lexeme === ':':
      c.ast.elem = 'def';
      c.ast.body = [];
      c.state = 'def';

      break;
    case c.ast.id !== undefined: {
      c.ast.var = 'eval';
      c.ast.fun = { elem: 'exp', var: 'id', id: c.ast.id };
      delete c.ast.id;
      c.ast.args = [{ elem: 'exp', var: 'id', id: lexeme }];
      c.state = 'exp_eval_args';

      break;
    }
    default:
      c.ast.elem = 'exp';
      c.ast.var = 'id';
      c.ast.id = lexeme;
    }
  },
  'exp_eval_args': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    default:
      c.ast.args.push({ elem: 'exp', var: 'id', id: lexeme });
    }
  },
  'def': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      c.stop_elem = true;
      c.scope = lexeme.i;

      break;
    case lexeme === '|':
      c.state = 'def_type_sum_cons';

      break;
    case lexeme === ',':
      c.ast.var = 'fun';
      c.ast.type = { elem: 'type', id: c.ast.body[0].id };
      c.ast.body = [];
      c.state = 'def_fun_type_args';

      break;
    case lexeme === '->':
      c.ast.var = 'fun';
      c.ast.type = { elem: 'type', id: c.ast.body[0].id };
      c.ast.body = [];
      c.state = 'def_fun_type_ret';

      break;
    case lexeme.startsWith('.'):
      c.ast.var = 'ext';
      c.ast.val = lexeme.substring(1);
      delete c.ast.body;
      c.sstop = true;

      break;
    case c.ast.body.length === 0:
      c.ast.var = 'type_sum';
      c.ast.body.push({ elem: 'cons', id: lexeme });

      break;
    default:
      c.ast.var = c.ast.var || 'type_sum';

      c.i--;
      c.stop_elem = true;
    }
  },
  'def_type_sum_cons': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    default:
      c.ast.body.push({ elem: 'cons', id: lexeme });
      c.state = 'def_type_sum_sep';
    }
  },
  'def_type_sum_sep': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    case lexeme !== '|':
      c.i--;
      c.stop_elem = true;
      break;
    default:
      c.state = 'def_type_sum_cons';
    }
  },
  'def_fun_type_args': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    case lexeme === '->':
      c.state = 'def_fun_type_ret';

      break;
    case lexeme !== ',':
      c.ast.type.id += `,${lexeme}`;

      break;
    }
  },
  'def_fun_type_ret': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    case lexeme === '=':
      c.ast.args = [];
      c.state = 'def_fun_args';

      break;
    default:
      c.ast.type.id += `->${lexeme}`;
    }
  },
  'def_fun_args': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      if (lexeme.i <= c.scope) {
        c.stop_elem = true;
      }
      c.scope = lexeme.i;

      break;
    case lexeme === '->':
      c.state = 'def_fun_body';

      break;
    case lexeme !== ',':
      c.ast.args.push({ elem: 'ptn', var: 'id', id: lexeme });

      break;
    }
  },
  'def_fun_body': c => {
    const lexeme = c.lexemes[c.i];

    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i < c.base_scope) {
        c.stop = true;
      }
      c.scope = lexeme.i;
      c.stop_elem = true;

      break;
    default: {
      const context = { lexemes: c.lexemes, start: c.i, stop: false, base_scope: c.scope + 1, scope: c.scope + 1 };
      const body = parse(c.lexemes, context);
      c.ast.body = body;
      c.stop_elem = true;
      c.i = context.i - 1;
    }
    }
  },
};
