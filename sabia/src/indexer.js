const index = (ast, _index = {}) => {
  if (ast.elem === 'seq') {
    for (const elem of ast.body) {
      _index = index(elem, _index);
    }

    return _index;
  }

  if (ast.elem === 'def') {
    _index[ast.id] = { ast: ast };
  }

  if (ast.var === 'type_sum') {
    for (const cons of ast.body) {
      _index[cons.id] = { ast: { elem: 'cons', id: cons.id, type: { elem: 'type', id: ast.id } } };
    }
  }

  if (ast.var === 'fun') {
    _index[ast.id].index = {};
    for (const arg of ast.args) {
      _index[ast.id].index[arg.id] = { ast: arg };
    }
  }

  return _index;
};

exports.index = index;
