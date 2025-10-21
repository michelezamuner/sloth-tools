const index = (ast, _index = {}, parent = undefined, parentCtx = {}) => {
  if (ast.elem === 'def' && ast.var === 'mod') {
    for (const elem of ast.body) {
      elem.name = `${ast.name}::${elem.name}`;
      _index[elem.name] = index(elem, _index, ast.name, parentCtx);
    }

    return _index;
  }

  if (ast.elem === 'def' && ast.var === 'ref') {
    ast.body = index(ast.body, _index, parent, parentCtx);
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    if (ast.fun.name) {
      if (ast.fun.name.indexOf('::') === -1) {
        ast.fun.name = parent + '::' + ast.fun.name;
      }
    } else {
      ast.fun = index(ast.fun, _index, parent, parentCtx);
    }
    ast.arg = index(ast.arg, _index, parent, parentCtx);
  }

  if (ast.elem === 'exp' && ast.var === 'fun') {
    ast.ctx = { ...parentCtx };
    ast.arg.type = index(ast.arg.type, _index, parent, parentCtx);
    ast.type = index(ast.type, _index, parent, parentCtx);
    ast.ctx[ast.arg.name] = ast.arg;
    ast.body = index(ast.body, _index, parent, ast.ctx);
  }

  if (ast.elem === 'exp' && ast.var === 'ref') {
    if (ast.name.indexOf('::') === -1) {
      ast.name = parent + '::' + ast.name;
    }
  }

  if (ast.elem === 'exp' && ast.var === 'cons') {
    if (ast.type.name.indexOf('::') === -1) {
      ast.type.name = parent + '::' + ast.type.name;
    }
  }

  if (ast.elem === 'type') {
    if (ast.name.indexOf('::') === -1) {
      ast.name = parent + '::' + ast.name;
    }
    ast.params = ast.params.map(p => index(p, _index, parent, parentCtx));
  }

  return ast;
};

exports.index = index;
