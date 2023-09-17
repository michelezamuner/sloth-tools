const parse = tokens => {
  const exprs = [];
  let start = 0;
  let sepId = tokens.indexOf(';');

  while (sepId !== -1) {
    exprs.push(parse(tokens.slice(start, sepId)));
    start = sepId + 1;
    sepId = tokens.indexOf(';', sepId + 1);
    if (sepId === -1) {
      exprs.push(parse(tokens.slice(start)));
    }
  }

  if (exprs.length) {
    return exprs;
  }

  if (tokens[0] === 'rel') {
    return {
      obj: 'rel',
      id: tokens[1],
      arg: tokens[3],
      val: tokens[5],
    }
  }

  return {
    obj: 'app',
    rel: tokens[0],
    arg: tokens[2],
  };
};

module.exports = {
  parse: parse,
};
