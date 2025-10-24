const type = index => {
  for (let i in index) {
    index[i] = typeElem(index[i], index);
  }

  return index;
};

exports.type = type;

function typeElem(ast, statCtx = {}, dynCtx = {}) {
  if (ast.elem === 'def' && ast.var === 'ref') {
    ast.body = typeElem(ast.body, statCtx, dynCtx);
    ast.type = ast.body.type;
  }

  if (ast.elem === 'exp' && ast.var === 'ref' ) {
    if (dynCtx[ast.name]) {
      ast.type = dynCtx[ast.name].type;
    } else if (statCtx[ast.name]) {
      ast.type = statCtx[ast.name].body.type;
    } else {
      const parts = ast.name.split('::');
      if (parts[0] === 'core') {
        const lib = require(`../core/${parts[1]}.types`);
        const type = lib[parts[2]];
        ast.type = type;
      }
    }
  }

  if (ast.elem === 'exp' && ast.var === 'fun') {
    ast.body = typeElem(ast.body, statCtx, dynCtx);
  }

  if (ast.elem === 'exp' && ast.var === 'eval') {
    ast.fun = typeElem(ast.fun, statCtx, dynCtx);
    ast.arg = typeElem(ast.arg, statCtx, dynCtx);
    if (ast.fun.type.params.length) {
      if (ast.fun.type.params[0].name.startsWith('<')) {
        ast.type = ast.arg.type;
      } else {
        ast.type = ast.fun.type.params[1];
      }
    } else {
      ast.type = ast.fun.type;
    }
  }

  return ast;
}


