const states = {
  'start': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    case lexeme === ':':
      ast.elem = 'def';
      ast.body = [];
      state = 'def';

      break;
    case ast.id !== undefined: {
      ast.var = 'eval';
      ast.fun = { elem: 'exp', var: 'id', id: ast.id };
      delete ast.id;
      // @todo: check for parentheses
      ast.args = [{ elem: 'exp', var: 'id', id: lexeme }];
      state = 'exp_eval_args';

      break;
    }
    default:
      ast.elem = 'exp';
      ast.var = 'id';
      ast.id = lexeme;
    }

    return [state, ind];
  },
  'exp_eval_args': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    default:
      ast.args.push({ elem: 'exp', var: 'id', id: lexeme });
    }

    return [state, ind];
  },
  'def': (ast, lexeme, [state, ind], lexConf) => {
    switch (true) {
    case typeof lexeme === 'object':
      state = 'stop';
      ind = lexeme.i;

      break;
    case lexeme === '|':
      state = 'def_type_sum_cons';

      break;
    case lexeme === ',':
      ast.var = 'fun';
      ast.type = { elem: 'type', id: ast.body[0].id };
      ast.body = [];
      state = 'def_fun_type_args';

      break;
    case lexeme === '->':
      ast.var = 'fun';
      ast.type = { elem: 'type', id: ast.body[0].id };
      ast.body = [];
      state = 'def_fun_type_ret';

      break;
    case lexeme.startsWith('.'):
      ast.var = 'ext';
      ast.val = lexeme.substring(1);
      delete ast.body;
      state = 'stop';

      break;
    case ast.body.length === 0:
      ast.var = 'type_sum';
      ast.body.push({ elem: 'cons', id: lexeme });

      break;
    default:
      ast.var = ast.var || 'type_sum';

      lexConf.newI = lexConf.i - 1;
      state = 'stop';
    }

    return [state, ind];
  },
  'def_type_sum_cons': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    default:
      ast.body.push({ elem: 'cons', id: lexeme });
      state = 'def_type_sum_sep';
    }

    return [state, ind];
  },
  'def_type_sum_sep': (ast, lexeme, [state, ind], lexConf) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    case lexeme !== '|':
      lexConf.newI = lexConf.i - 1;
      state = 'stop';
      break;
    default:
      state = 'def_type_sum_cons';
    }

    return [state, ind];
  },
  'def_fun_type_args': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    case lexeme === '->':
      state = 'def_fun_type_ret';

      break;
    case lexeme !== ',':
      ast.type.id += `,${lexeme}`;

      break;
    }

    return [state, ind];
  },
  'def_fun_type_ret': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    case lexeme === '=':
      ast.args = [];
      state = 'def_fun_args';

      break;
    default:
      ast.type.id += `->${lexeme}`;
    }

    return [state, ind];
  },
  'def_fun_args': (ast, lexeme, [state, ind]) => {
    switch (true) {
    case typeof lexeme === 'object':
      if (lexeme.i <= ind) {
        state = 'stop';
      }
      ind = lexeme.i;

      break;
    case lexeme === '->':
      state = 'def_fun_body';

      break;
    case lexeme !== ',':
      ast.args.push({ elem: 'ptn', var: 'id', id: lexeme });

      break;
    }

    return [state, ind];
  },
  'def_fun_body': (ast, lexeme, [state, ind], lexConf) => {
    switch (true) {
    case typeof lexeme === 'object':
      ind = lexeme.i;
      state = 'stop';

      break;
    default: {
      const [body, newI] = parse_elem(lexConf.lexemes, lexConf.i, ind);
      ast.body = body;
      state = 'stop';
      lexConf.newI = newI;
    }
    }

    return [state, ind];
  },
};

const parse_elem = (lexemes, id, ind) => {
  const ast = {};
  let state = 'start';
  for (let i = id; i < lexemes.length; i++) {
    const lexeme = lexemes[i];
    // console.log('STATE', state);
    // console.log('AST', JSON.stringify(ast, null, 2));
    // console.log('INDENTATION', ind);
    // console.log('LEXEME', lexeme);
    const lexConf = { lexemes: lexemes, i: i, newI: null, ind: 0 };
    [state, ind] = states[state](ast, lexeme, [state, ind], lexConf);

    if (state === 'stop') {
      return [ast, lexConf.newI || i];
    }
  }

  return [ast, lexemes.length];
};

const parse = lexemes => {
  let ind = 0;
  const asts = [];
  for (let i = 0; i < lexemes.length; i++) {
    const [ast, id] = parse_elem(lexemes, i, ind);
    i = id;
    if (Object.keys(ast).length !== 0) {
      asts.push(ast);
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

exports.parse = ast => parse(ast);
