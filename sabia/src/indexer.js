const index = (ast, _index = {}) => {
  for (const elem of ast.body) {
    _index[`${ast.id}::${elem.id}`] = { ast: elem };
  }

  return _index;
};

exports.index = index;
