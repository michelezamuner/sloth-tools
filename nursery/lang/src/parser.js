const parse = tokens => {
  let lastRel = { id: -1 };

  const groups = [[]];
  let groupId = 0;
  for (const token of tokens) {
    if (token === '(') {
      groupId++;
      groups[groupId] = [];

      continue;
    }

    if (token === ')') {
      const parsedGroup = parseExpr(groups[groupId], lastRel);
      groupId--;
      groups[groupId].push(parsedGroup);

      continue;
    }

    groups[groupId].push(token);
  }

  return parseExpr(groups[0], lastRel);
};

const parseExpr = (tokens, lastRel) => {
  const exprs = [];

  let start = 0;
  let sepId = tokens.indexOf(';');

  while (sepId !== -1) {
    const expr = parseExpr(tokens.slice(start, sepId), lastRel);
    if (expr.obj === 'rel' && exprs.find(e => e.id === expr.id)) {
      throw `Relation \`${expr.id}\` is defined multiple times`;
    }
    exprs.push(expr);

    start = sepId + 1;
    sepId = tokens.indexOf(';', start);
  }

  if (exprs.length) {
    const expr = parseExpr(tokens.slice(start), lastRel);
    if (expr.obj === 'rel' && exprs.find(e => e.id === expr.id)) {
      throw `Relation \`${expr.id}\` is defined multiple times`;
    }
    exprs.push(expr);

    return exprs;
  }

  if (tokens[0] === 'rel') {
    const hasId = tokens[2] === 'of';
    lastRel.id++;
    const id = hasId ? tokens[1] : `#rel_${lastRel.id}`;
    const rel = {};
    const matchId = tokens.indexOf('match');
    if (matchId === -1) {
      const key = hasId ? tokens[3] : tokens[2];
      const val = hasId ? tokens[5] : tokens[4];
      rel[key] = val;
    } else {
      const relList = tokens.slice(matchId + 3);
      let state = 'key';
      let key = null;
      for (const token of relList) {
        if (token === 'is') {
          state = 'val';

          continue;
        }

        if (token === ',') {
          state = 'key';

          continue;
        }

        if (state === 'key') {
          key = token;

          continue;
        }

        if (state === 'val') {
          rel[key] = token;
          key = null;
        }
      }
    }

    return { obj: 'rel', id: id, rel: rel };
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
  parse: parse,
};
