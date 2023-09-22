module.exports = {
  tokenize: code => {
    const tokens = [];
    const token = [];
    let isComment = false;
    for (let i in code) {
      let char = code[i];
      if (char === '\n' && code[+i+1].trim() !== '') {
        char = ';';
      }

      if (!isComment && char === '#') {
        isComment = true;
      }

      if (isComment && char === ';') {
        isComment = false;
      }

      if (isComment) {
        continue;
      }

      if (char.trim() === '') {
        if (token.length) {
          tokens.push(token.join(''));
          token.length = 0;
        }
        continue;
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
