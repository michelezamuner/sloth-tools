exports.parse = code => {
  const lexemes = [];
  const lexeme = [];

  const chars = code.split('');
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    lexeme.push(char);
  }

  lexemes.push(lexeme.join(''));
  lexeme.length = 0;


  return lexemes;
};
