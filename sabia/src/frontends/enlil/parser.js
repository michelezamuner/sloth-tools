const parse = (lexemes, context) => {
  if (context === undefined) {
    context = {
      type: ['base'],
      lexemes: lexemes,
      current: 0,
      ast: {},
      stop: false,
    };
  }

  let maxCycles = 100;
  while (!context.stop && context.current < lexemes.length) {
    if (maxCycles-- <= 0) {
      throw 'INFINITE LOOP';
    }
    exec('start', context);
  }

  return context.ast;
};
exports.parse = parse;

const exec = (state, context, data) => {
  if (context.current >= context.lexemes.length) {
    return;
  }
  states[state](context.lexemes[context.current], context, data);
};

const states = {
  'start': (lexeme, context) => {
    switch (true) {
    case lexeme === '(':
      if (context.ast.elem === undefined) {
        context.current++;
        exec('group', context);
      } else {
        exec('exp_eval', context);
      }
      break;
    case lexeme === '|'/* && context.lexemes[context.current + 2] === ':'*/:
      exec('exp_fun', context);
      break;
      // case context.type[context.type.length - 1] === 'group' && lexeme === ')':
      //   context.stop = true;
      //   context.current++;
      //   break;
    // case [/*'eval', */'def_fun_arg'].includes(context.type[context.type.length - 1]) && (lexeme === ')' || lexeme === ','):
    //   context.stop = true;
    //   break;
    // case context.type[context.type.length - 1] === 'exp_fun_arg' && (lexeme === '|' || lexeme === ','):
    //   context.stop = true;
    //   break;
    // case context.type[context.type.length - 1] === 'fun_ret' && lexeme === '{':
    //   context.stop = true;
    //   break;
      // case ['fun_body'].includes(context.type[context.type.length - 1]) && lexeme === '}':
      //   context.stop = true;
      //   break;
      // case context.lexemes[context.current + 1] === '(':
      //   exec('exp_eval', context);
      //   break;
    case lexeme === 'pub':
      context.ast.vis = 'pub';

      context.current++;
      break;
    case lexeme === 'enum':
      exec('def_enum', context);
      break;
    case lexeme === 'const':
      exec('def_id', context);
      break;
    case lexeme === 'fn':
      exec('def_fun', context);
      break;
    case lexeme === 'mod':
      exec('def_mod', context);
      break;
    case context.type[context.type.length - 1] === 'maybe_exp_id':
      exec('maybe_exp_id', context);

      break;
    default: {
      const ctx = {
        type: [...context.type, 'maybe_exp_id'],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.current = ctx.current;
      context.ast = ast;

      if (context.lexemes[context.current + 1] === '(') {
        // This exp might be the function of an eval
        context.current++;
      } else {
        context.stop = true;
      }
    }
    }
  },
  'group': (lexeme, context) => {
    switch (true) {
    case lexeme === ')':
      if (context.lexemes[context.current + 1] === '(') {
        // This group might be the function of an eval
        context.current++;
      } else {
        context.stop = true;
      }

      break;
    default: {
      const ctx = {
        type: [...context.type, 'group'],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.current = ctx.current + 1;
      context.ast = ast;

      exec('group', context);
    }
    }
  },
  'maybe_exp_id': (lexeme, context) => {
    switch (true) {
    case context.ast.elem === undefined:
      if (lexeme.charAt(0) === lexeme.charAt(0).toUpperCase()) {
        exec('maybe_exp_enum', context, lexeme);

        break;
      }
      context.ast = {
        elem: 'exp',
        var: 'id',
        id: lexeme,
      };

      if (context.lexemes[context.current + 1] !== '::') {
        context.stop = true;
      } else {
        context.current++;
        exec('maybe_exp_id', context);
      }

      break;
    case lexeme === '::':
      context.current++;
      exec('maybe_exp_fq_id', context, true);
      break;
    }
  },
  'maybe_exp_fq_id': (lexeme, context, hasNext) => {
    switch (true) {
    case lexeme === '::':
      context.current++;
      exec('maybe_exp_fq_id', context, true);
      break;
    case hasNext && lexeme.charAt(0) === lexeme.charAt(0).toUpperCase():
      exec('maybe_exp_enum', context, `::${context.ast.id}::${lexeme}`);
      break;
    case hasNext:
      context.ast.id = `${context.ast.id}::${lexeme}`;

      if (context.lexemes[context.current + 1] === '::') {
        context.current++;
        exec('maybe_exp_fq_id', context);
      } else {
        context.ast.id = `::${context.ast.id}`;
        context.stop = true;
      }

      break;
    }
  },
  'maybe_exp_enum': (lexeme, context, type) => {
    switch (true) {
    case context.ast.var === 'enum':
      context.ast.body = {
        elem: 'cons',
        type: { elem: 'type', var: 'id', id: type },
        id: lexeme,
      };

      context.stop = true;
      break;
    case context.lexemes[context.current + 1] !== '::':
      context.ast = {
        elem: 'type',
        var: 'id',
        id: type,
      };

      context.stop = true;
      break;
    default:
      context.ast = {
        elem: 'exp',
        var: 'enum',
        type: { elem: 'type', var: 'id', id: type },
      };

      context.current += 2;
      exec('maybe_exp_enum', context, type);
    }
  },
  'exp_eval': (lexeme, context) => {
    switch (true) {
    case lexeme === ')':
      if (context.lexemes[context.current + 1] === '(') {
        // This eval might be the function of another eval
        context.current++;
      } else {
        context.stop = true;
      }

      break;
    case context.ast.elem === undefined:
      context.ast.elem = 'exp';
      context.ast.var = 'eval';
      context.ast.fun = { elem: 'exp', var: 'id', id: lexeme };
      context.ast.args = [];

      context.current += 2;
      exec('exp_eval', context);
      break;
    // If the function is another expression
    case context.ast.fun === undefined || context.ast.args.length !== 0:
      context.ast = {
        elem: 'exp',
        var: 'eval',
        fun: Object.assign({}, context.ast),
        args: [],
      };

      context.current++;
      exec('exp_eval', context);
      break;
    default: {
      do {
        const ctx = {
          type: [...context.type, 'eval'],
          lexemes: context.lexemes,
          current: context.current,
          ast: {},
          stop: false,
        };
        const ast = parse(context.lexemes, ctx);
        context.current = ctx.current;
        context.ast.args.push(ast);
        if (context.lexemes[context.current + 1] === ',') {
          context.current += 2;
        } else {
          context.current++;
          break;
        }
      } while (context.lexemes[context.current - 1] === ',');

      exec('exp_eval', context);
    }
    }
  },
  'exp_fun': (lexeme, context) => {
    switch (true) {
    default:
      context.ast = {
        elem: 'exp',
        var: 'fun',
        type: { elem: 'type', var: 'fun', args: [] },
        args: [],
      };

      context.current++;
      exec('exp_fun_args', context);
    }
  },
  'exp_fun_args': (lexeme, context, elem) => {
    const argStopper = elem === 'def' ? ')' : '|';
    const type = elem === 'def' ? 'def_fun_arg' : 'exp_fun_arg';

    switch(true) {
    case lexeme === argStopper:
      context.current += 2;
      exec('exp_fun_ret', context);
      break;
    case context.lexemes[context.current - 1] === ':': {
      const ctx = {
        type: [...context.type, type],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.ast.args[context.ast.args.length - 1].type = ast;
      context.ast.type.args.push(ast);
      context.current = ctx.current + 1;

      exec('exp_fun_args', context, elem);
      break;
    }
    case lexeme === ',':
      context.current++;
      exec('exp_fun_args', context, elem);
      break;
    case context.lexemes[context.current - 1] === ',':
    default:
      context.ast.args.push({
        elem: 'pat',
        var: 'id',
        id: lexeme,
      });

      context.current += 2;
      exec('exp_fun_args', context, elem);
    }
  },
  'exp_fun_ret': (lexeme, context) => {
    switch (true) {
    default: {
      const ctx = {
        type: [...context.type, 'fun_ret'],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.current = ctx.current;
      context.ast.type.ret = ast;

      context.current += 2;
      exec('exp_fun_body', context);
    }
    }
  },
  'exp_fun_body': (lexeme, context) => {
    switch(true) {
    case lexeme === '}':
      if (context.lexemes[context.current + 1] === '(') {
        // This fun might be the function of an eval
        context.current++;
      } else {
        context.stop = true;
      }

      break;
    default: {
      const ctx = {
        type: [...context.type, 'fun_body'],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.current = ctx.current;
      context.ast.body = ast;

      context.current++;
      exec('exp_fun_body', context);
    }
    }
  },
  'def_enum': (lexeme, context) => {
    switch(true) {
    case lexeme === 'enum':
      context.current++;
      exec('def_enum', context);
      break;
    default:
      context.ast = {
        elem: 'def',
        var: 'enum',
        id: lexeme,
        vis: context.ast.vis || 'priv',
        body: [],
      };
      context.current += 2;
      exec('def_enum_cons', context, lexeme);
    }
  },
  'def_enum_cons': (lexeme, context, type) => {
    switch (true) {
    case lexeme === ',':
      context.current++;
      exec('def_enum_cons', context, type);
      break;
    case lexeme === '}':
      context.stop = true;
      break;
    case context.lexemes[context.current - 1] === ',':
    default:
      context.ast.body.push({
        elem: 'cons',
        type: { elem: 'type', var: 'id', id: type },
        id: lexeme,
      });
      context.current++;
      exec('def_enum_cons', context, type);
    }
  },
  'def_id': (lexeme, context) => {
    switch (true) {
    case lexeme === 'const':
      context.current++;
      exec('def_id', context);
      break;
    case lexeme === '=':
      context.current++;
      exec('def_id', context);
      break;
    case lexeme === ';':
      context.stop = true;
      break;
    case context.lexemes[context.current - 1] === '=': {
      const ctx = {
        type: [...context.type, 'def_id'],
        lexemes: context.lexemes,
        current: context.current,
        ast: {},
        stop: false,
      };
      const ast = parse(context.lexemes, ctx);
      context.current = ctx.current;
      context.ast.body = ast;

      context.current++;
      exec('def_id', context);
      break;
    }
    default:
      context.ast = {
        elem: 'def',
        var: 'ref',
        id: lexeme,
        vis: context.ast.vis || 'priv',
        body: {},
      };
      context.current++;
      exec('def_id', context);
    }
  },
  'def_fun': (lexeme, context) => {
    switch (true) {
    case lexeme === 'fn':
      context.current++;
      exec('def_fun', context);
      break;
    case lexeme === '(':
      context.current++;
      exec('exp_fun_args', context, 'def');
      break;
    default:
      context._tmp = {
        elem: 'def',
        var: 'ref',
        id: lexeme,
        vis: context.ast.vis || 'priv',
        body: {},
      };
      context.ast = {
        elem: 'exp',
        var: 'fun',
        type: { elem: 'type', var: 'fun', args: [] },
        args: [],
      };
      context.current++;
      exec('def_fun', context);
      context._tmp.body = Object.assign({}, context.ast);
      context.ast = context._tmp;
      delete context._tmp;
    }
  },
  'def_mod': (lexeme, context) => {
    switch(true) {
    case lexeme === 'mod':
      context.current++;
      exec('def_mod', context);
      break;
    case lexeme === '{':
      context.current++;
      exec('def_mod', context);
      break;
    case context.lexemes[context.current - 1] === '{': {
      while(context.lexemes[context.current + 1] !== undefined) {
        const ctx = {
          type: [...context.type, 'def_mod'],
          lexemes: context.lexemes,
          current: context.current,
          ast: {},
          stop: false,
        };
        const ast = parse(context.lexemes, ctx);
        context.current = ctx.current;
        context.ast.body.push(ast);

        context.current++;
      }
      context.current++;
      context.stop = true;
      break;
    }
    default:
      context.ast = {
        elem: 'mod',
        id: lexeme,
        body: [],
      };

      context.current++;
      exec('def_mod', context);
    }
  },
};
