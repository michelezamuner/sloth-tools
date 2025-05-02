const stoppers = [':', '=', '|', '(', ')'];
const nonStoppers = ['::'];

exports.parse = code => {
  const lexemes = [];
  const lexeme = [];
  let hasCodeStarted = false;
  let baseIndentation = 0;
  let indentation = 0;
  let isNewLine = false;
  for (let i in code.split('')) {
    const char = code[i];
    const prev = code[+i - 1];
    const next = code[+i + 1];
    if (!hasCodeStarted && char.trim() !== '') {
      hasCodeStarted = true;
    }

    if (!hasCodeStarted && char.trim() === '' && char !== '\n') {
      baseIndentation++;
    }

    if (hasCodeStarted && char === '\n') {
      isNewLine = true;

      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }

      continue;
    }

    if (isNewLine && char.trim() === '') {
      indentation++;
    }

    if (isNewLine && char.trim() !== '') {
      lexemes.push({ scope: (indentation - baseIndentation) });
      isNewLine = false;
      indentation = 0;
    }

    if (char.trim() === '' || isStopper(char, prev, next)) {
      if (lexeme.length) {
        lexemes.push(lexeme.join(''));
        lexeme.length = 0;
      }
    }

    if (char.trim() !== '') {
      if (isStopper(char, prev, next)) {
        lexemes.push(char);
      } else {
        lexeme.push(char);
      }
    }
  }

  if (lexeme.length) {
    lexemes.push(lexeme.join(''));
  }
  lexemes.push({ scope: -1 });

  return lexemes;
};

const isStopper = (char, prev, next) => {
  return stoppers.includes(char)
    && !nonStoppers.includes(`${prev}${char}`)
    && !nonStoppers.includes(`${char}${next}`);
};
