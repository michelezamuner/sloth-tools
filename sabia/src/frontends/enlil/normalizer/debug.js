const parse = lexemes => {
  const result = [];
  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];
    if (lexeme === 'dbg!') {
      result.push('core');
      result.push('::');
      result.push('lang');
      result.push('::');
      result.push('debug');
    } else {
      result.push(lexeme);
    }
  }

  return result;
};
exports.parse = parse;
