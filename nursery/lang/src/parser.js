const parseMatch = tokens => {
  const rels = {};
  let state = 'key';
  let currentKey = null;
  for (const token of tokens) {
    if (token === 'is' || token === ',') {
      continue;
    }

    if (state === 'key') {
      currentKey = token;
      state = 'val';

      continue;
    }

    if (state === 'val') {
      rels[currentKey] = token;
      state = 'key';
    }
  }

  return rels;
};

const parseRelVal = tokens => {
  if (tokens[0] === 'match') {
    return parseMatch(tokens.slice(3));
  }

  return tokens[0];
};

const parseRel = tokens => {
  const keyStartId = tokens.indexOf('of');
  const valStartId = tokens.indexOf('is');
  const hasName = keyStartId === 2;
  const key = tokens.slice(keyStartId + 1, valStartId)[0];
  const val = parseRelVal(tokens.slice(valStartId + 1));

  const rel = { obj: 'rel' };
  if (hasName) {
    rel.id = tokens[1];
  }
  rel.rel = typeof val === 'object' && val.obj !== 'rel' ? val : { [key]: val };

  return rel;
};

const parseApp = tokens => {
  return { obj: 'app', rel: tokens[0], arg: tokens[2] };
};

const parseExpr = tokens => {
  return tokens[0] === 'rel' ? parseRel(tokens) : parseApp(tokens);
};

const parseLine = tokens => {
  const groups = [[]];
  let groupId = 0;

  for (const token of tokens) {
    if (token === '(') {
      groupId++;
      groups.push([]);

      continue;
    }

    if (token === ')') {
      const group = parseExpr(groups[groupId]);
      groupId--;
      groups[groupId].push(group);

      continue;
    }

    groups[groupId].push(token);
  }

  return parseExpr(groups[0]);
};

const parseLines = tokens => {
  const exprs = [];
  let start = 0;
  let sepId;

  do {
    sepId = tokens.indexOf(';', start);
    const line = sepId === -1
      ? tokens.slice(start)
      : tokens.slice(start, sepId);
    const expr = parseLine(line);
    if (expr.id && exprs.find(e => e.id === expr.id)) {
      throw `Relation \`${expr.id}\` is already defined`;
    }
    exprs.push(parseLine(line));
    start = sepId + 1;
  } while (sepId !== -1);

  return exprs;
};

module.exports = {
  parse: parseLines,
};
