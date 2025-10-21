const parse = lexemes => {
  const aliases = [];
  let lexemesWithoutAliases = [];
  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];
    if (lexeme === 'alias') {
      const [foundAliases, newI] = extractAlias(lexemes, i + 1);
      for (const alias of foundAliases) {
        aliases.push(alias);
      }
      i = newI;
    } else {
      lexemesWithoutAliases.push(lexeme);
    }
  }

  const lexemesWithReplacedAliases = [];
  const aliasesRefs = aliases.map(a => a[a.length - 1]);
  for (let i = 0; i < lexemesWithoutAliases.length; i++) {
    const lexeme = lexemesWithoutAliases[i];
    const id = aliasesRefs.findIndex(r => r === lexeme);
    if (id !== -1) {
      for (let j = 0; j < aliases[id].length; j++) {
        lexemesWithReplacedAliases.push(aliases[id][j]);
      }
    } else {
      lexemesWithReplacedAliases.push(lexeme);
    }
  }

  return lexemesWithReplacedAliases;
};
exports.parse = parse;

const extractAlias = (lexemes, start) => {
  const aliases = [[]];
  let i = start;
  let group = null;
  let partial = null;
  for (; lexemes[i] !== ';'; i++) {
    const lexeme = lexemes[i];
    if (lexeme === '{') {
      group = [];
      partial = JSON.stringify(aliases[aliases.length - 1]);
    } else if (group !== null && lexeme !== '}' && lexeme !== ',') {
      group.push(lexeme);
    } else if (lexeme === ',' || lexeme === '}') {
      for (const el of group) {
        aliases[aliases.length - 1].push(el);
      }
      if (lexeme !== '}') {
        aliases.push(JSON.parse(partial));
      }
      group = [];
    } else {
      aliases[aliases.length - 1].push(lexeme);
    }
  }

  return [aliases, i];
};
