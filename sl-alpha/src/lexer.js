module.exports = class Lexer {
  parse(code) {
    const lexemes = [];

    const lexeme = [];
    for (let i = 0; i < code.length; i++) {
      const char = code.charAt(i);

      if(char.trim() === '') {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
          lexeme.length = 0;
        }

        continue;
      }

      if (char === '-' && code.charAt(i + 1) === '>') {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
          lexeme.length = 0;
        }
        i++;
        lexemes.push('->');

        continue;
      }

      if (char === ':' && code.charAt(i + 1) === '=') {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
          lexeme.length = 0;
        }
        i++;
        lexemes.push(':=');

        continue;
      }

      if (char === ':' && code.charAt(i + 1) === ':') {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
          lexeme.length = 0;
        }
        i++;
        lexemes.push('::');

        continue;
      }

      if (char === ':') {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
          lexeme.length = 0;
        }
        i++;
        lexemes.push(':');

        continue;
      }

      lexeme.push(char);
    }

    if (lexeme.length) {
      lexemes.push(lexeme.join(''));
    }

    return lexemes;
  }
};
