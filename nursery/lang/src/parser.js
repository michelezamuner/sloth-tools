let lastRelId = -1;

const parseGroups = tokens => {
  const parsedTokens = [];

  let isGroup = false;
  const group = [];

  for (const token of tokens) {
    if (token === '(') {
      isGroup = true;

      continue;
    }

    if (token === ')') {
      parsedTokens.push(parseExpr(group));
      isGroup = false;

      continue;
    }

    if (isGroup) {
      group.push(token);

      continue;
    }

    parsedTokens.push(token);
  }

  return parsedTokens;
};

const parseExpr = tokens => {
  const exprs = [];

  let start = 0;
  let sepId = tokens.indexOf(';');

  while (sepId !== -1) {
    exprs.push(parseExpr(tokens.slice(start, sepId)));
    start = sepId + 1;
    sepId = tokens.indexOf(';', start);
    if (sepId === -1) {
      exprs.push(parseExpr(tokens.slice(start)));
    }
  }

  if (exprs.length) {
    return exprs;
  }

  if (tokens[0] === 'rel') {
    return {
      obj: 'rel',
      id: tokens[2] === 'of' ? tokens[1] : `#rel_${++lastRelId}`,
      arg: tokens[2] === 'of' ? tokens[3] : tokens[2],
      val: tokens[2] === 'of' ? tokens[5] : tokens[4],
    }
  }

  if (typeof tokens[0] === 'object') {
    exprs.push(tokens[0]);
    exprs.push({
      obj: 'app',
      rel: tokens[0].id,
      arg: tokens[2],
    });

    return exprs;
  }

  return {
    obj: 'app',
    rel: tokens[0],
    arg: tokens[2],
  };
};

module.exports = {
  parse: tokens => parseExpr(parseGroups(tokens)),
};
