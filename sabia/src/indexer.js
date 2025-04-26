const index = (ast, _index = {}, parent = undefined, parentCtx = {}) => {
  if (ast.elem === 'mod') {
    for (const elem of ast.body) {
      elem.id = `::${ast.id}::${elem.id}`;
      delete elem.vis;
      _index[elem.id] = index(elem, _index, `::${ast.id}`, parentCtx);
    }

    return _index;
  }

  if (ast.elem === 'def' && ast.var === 'ref') {
    ast.body = index(ast.body, _index, parent, parentCtx);
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    if (ast.fun.id) {
      ast.fun.id = `${parent}::${ast.fun.id}`;
    } else {
      ast.fun = index(ast.fun, _index, parent, parentCtx);
    }
    ast.args = ast.args.map(arg => index(arg, _index, parent, parentCtx));
  }

  if (ast.elem === 'exp' && ast.var === 'fun') {
    ast.ctx = { ...parentCtx };
    ast.args = ast.args.map(a => {
      a.id = `${parent}::${a.id}`;
      a.type.id = `${parent}::${a.type.id}`;
      ast.ctx[a.id] = a;

      return a;
    });
    ast.body = index(ast.body, _index, parent, ast.ctx);
  }

  if (ast.elem === 'exp' && ast.var === 'id') {
    ast.id = `${parent}::${ast.id}`;
  }

  if (ast.elem === 'exp' && ast.var === 'enum') {
    ast.type.id = `${parent}::${ast.type.id}`;
  }

  return ast;
};

exports.index = index;
