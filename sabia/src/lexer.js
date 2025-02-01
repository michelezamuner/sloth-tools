const stoppers = [':', '|', ',', '(', ')'];

exports.parse = code => {
  const lexemes = [];
  const lexeme = [];
  let hasCodeStarted = false;
  let baseIndentation = 0;
  let indentation = 0;
  let isNewLine = false;
  for (const char of code.split('')) {
    if (!hasCodeStarted && char.trim() !== '') {
      hasCodeStarted = true;
    }

    if (!hasCodeStarted && char.trim() === '' && char !== '\n') {
      baseIndentation++;
    }

    if (hasCodeStarted && char === '\n') {
      isNewLine = true;

      continue;
    }

    if (isNewLine && char.trim() === '') {
      indentation++;
    }

    if (isNewLine && char.trim() !== '') {
      lexemes.push({ i: (indentation - baseIndentation) });
      isNewLine = false;
      indentation = 0;
    }

    if (char.trim() === '' || stoppers.includes(char)) {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }
    }

    if (char.trim() !== '') {
      if (stoppers.includes(char)) {
        lexemes.push(char);
      } else {
        lexeme.push(char);
      }
    }
  }

  if (lexeme.length) {
    lexemes.push(lexeme.join(''));
  }

  return lexemes;
};
