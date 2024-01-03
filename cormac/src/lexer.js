exports.parse = code => {
  const lexemes = [];
  const lexeme = [];

  const chars = code.split('');
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char.trim() === '') {
      flush(lexemes, lexeme);
      continue;

    }

    if (char === ';') {
      flush(lexemes, lexeme);
      lexeme.push(char);
      flush(lexemes, lexeme);

      continue;
    }

    if (['++', ':='].includes(`${char}${chars[+i+1]}`)) {
      flush(lexemes, lexeme);
      lexeme.push(char);
      lexeme.push(chars[+i+1]);
      flush(lexemes, lexeme);
      i++;

      continue;
    }
    if (char === '(' || char === ')') {
      flush(lexemes, lexeme);
      lexeme.push(char);
      flush(lexemes, lexeme);

      continue;
    }

    lexeme.push(char);
  }
  flush(lexemes, lexeme);

  return lexemes;
};

function flush(lexemes, lexeme) {
  if (lexeme.length === 0) {
    return;
  }

  lexemes.push(lexeme.join(''));
  lexeme.length = 0;
}
