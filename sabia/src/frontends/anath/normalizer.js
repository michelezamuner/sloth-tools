const parse = lexemes => {
  let result = lexemes;
  result = parseScript(result);
  result = parseAliases(result);
  result = parseDebug(result);

  return result;
};

exports.parse = parse;

function parseScript(lexemes) {
  if (lexemes[1] === '{') {
    return ['::', ...lexemes];
  }

  if (lexemes[0] === '::' && lexemes[2] === '{') {
    return lexemes;
  }

  let result = [
    '::', 'app', '{',
    '@then', '=', 'core', '::', 'lang', '::', 'then', ';',
    '@sys', '=', 'std', '::', 'sys', ';',
    '@Proc', '=', 'sys', '::', 'Proc', ';',
    '@Exit', '=', 'sys', '::', 'Exit', ';',
  ];

  let nonDefs = [];
  let defs = [];
  let isDef = false;
  for (const lexeme of lexemes) {
    if (lexeme === '=') {
      isDef = true;
      defs = [...defs, ...nonDefs, '='];
      nonDefs = [];

      continue;
    }

    if (isDef && lexeme === ';') {
      isDef = false;
      defs.push(';');

      continue;
    }

    if (isDef) {
      defs.push(lexeme);
    }

    if (!isDef) {
      nonDefs.push(lexeme);
    }
  }

  result = result.concat(defs);
  result = result.concat([
    '::', 'main', '=', 'p', ':', 'Proc', '->', 'Exit',
    '(',
  ]);

  let exps = [[]];
  let current = [];
  for (const lexeme of nonDefs) {
    if (lexeme === '=') {
      isDef = true;
    }
    if (!isDef && lexeme === ';') {
      if (exps.length === 1) {
        exps[0].push(')');
        current = exps[0];
        exps.push([]);
      } else {
        exps[1].push(')');
        current = ['then', '(', ...current, ')', '(', ...exps[1], ')'];
      }

      continue;
    }

    if (!exps.at(-1).length) {
      exps.at(-1).push('!');
      exps.at(-1).push('(');
    }
    exps.at(-1).push(lexeme);
  }
  if (current.length) {
    current = ['then', '(', ...current, ')', '(', 'Exit', '::', 'Ok', ')'];
  } else {
    current = ['Exit', '::', 'Ok'];
  }

  result = result
    .concat(current)
    .concat([
      ')', ';', '}'
    ]);

  return result;
}

function parseAliases(lexemes) {
  let result = [];

  const aliases = {};
  let isAlias = false;
  let currentAlias = null;
  for (const lexeme of lexemes) {
    if (lexeme.startsWith('@')) {
      currentAlias = lexeme.slice(1);
      aliases[currentAlias] = [];
      isAlias = true;

      continue;
    }

    if (isAlias && lexeme === '=') {
      continue;
    }

    if (isAlias && lexeme === ';') {
      isAlias = false;

      continue;
    }

    if (isAlias) {
      if (lexeme !== currentAlias && Object.keys(aliases).includes(lexeme)) {
        aliases[currentAlias] = aliases[currentAlias].concat(aliases[lexeme]);
      } else {
        aliases[currentAlias].push(lexeme);
      }

      continue;
    }

    if (Object.keys(aliases).includes(lexeme)) {
      result = result.concat(aliases[lexeme]);

      continue;
    }

    if (!isAlias) {
      result.push(lexeme);

      continue;
    }
  }

  return result;
}

function parseDebug(lexemes) {
  let result = [];
  for (const lexeme of lexemes) {
    if (lexeme === '!') {
      result = result.concat([
        'core', '::', 'lang', '::', 'debug',
      ]);

      continue;
    }

    result.push(lexeme);
  }

  return result;
}
