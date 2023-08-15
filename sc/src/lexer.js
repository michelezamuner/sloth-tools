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

      lexeme.push(char);
    }

    if (lexeme.length) {
      lexemes.push(lexeme.join(''));
    }

    return lexemes;
  }
};
