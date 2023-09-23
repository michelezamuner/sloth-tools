module.exports = {
  tokenize: code => {
    const tokens = [];
    const token = [];
    let isComment = false;
    let maybeNewline = false;
    for (let i in code) {
      let char = code[i];
      if (char === '\n') {
        maybeNewline = true;
      }

      if (!isComment && char === '#') {
        isComment = true;

        continue;
      }

      if (isComment && (char === ';' || char === '\n')) {
        isComment = false;
        if (char === ';') {
          tokens.push(';');
        }

        continue;
      }

      if (isComment) {
        continue;
      }

      if (char.trim() === '') {
        if (maybeNewline && char !== '\n') {
          maybeNewline = false;
        }
        if (token.length) {
          tokens.push(token.join(''));
          token.length = 0;
        }
        continue;
      }

      if (maybeNewline) {
        if (tokens.length && tokens[tokens.length - 1] !== ';') {
          tokens.push(';');
        }
        maybeNewline = false;
      }

      if (['(', ')', ';', ',', '|'].includes(char)) {
        if (token.length) {
          tokens.push(token.join(''));
          token.length = 0;
        }
        tokens.push(char);

        continue;
      }

      token.push(char);
    }
    if (token.length) {
      tokens.push(token.join(''));
    }

    return tokens;
  },
};
