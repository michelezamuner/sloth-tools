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
  const rels = [];
  const apps = [];

  let start = 0;
  let sepId = tokens.indexOf(';');

  while (sepId !== -1) {
    const expr = parseExpr(tokens.slice(start, sepId));
    if (expr.obj === 'rel') {
      let rel = rels.find(r => r.id === expr.id);
      if (!rel) {
        rel = { obj: 'rel', id: expr.id, rel: {} };
        rels.push(rel);
      }
      rel.rel = { ...rel.rel, ...expr.rel };
    } else {
      apps.push(expr);
    }

    start = sepId + 1;
    sepId = tokens.indexOf(';', start);
  }

  if (rels.length || apps.length) {
    const expr = parseExpr(tokens.slice(start));
    if (expr.obj === 'rel') {
      let rel = rels.find(r => r.id === expr.id);
      if (!rel) {
        rel = { obj: 'rel', id: expr.id, rel: {} };
        rels.push(rel);
      }
      rel.rel = { ...rel.rel, ...expr.rel };
    } else {
      apps.push(expr);
    }

    return [...rels, ...apps];
  }

  if (tokens[0] === 'rel') {
    const hasId = tokens[2] === 'of';
    const id = hasId ? tokens[1] : `#rel_${++lastRelId}`;
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
    apps.push(tokens[0]);
    apps.push({
      obj: 'app',
      rel: tokens[0].id,
      arg: tokens[2],
    });

    return apps;
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
