const separators = ['::', '(', ')', ',', ':', '->', ';', '{', '}', '=', '|', '<', '>'];
const maxSeparatorSize = 2;

const parse = code => {
  let lexemes = [];
  let lexeme = '';
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (char.trim() === '') {
      if (lexeme.length > 0) {
        lexemes.push(lexeme);
      }
      lexeme = '';

      continue;
    }
    const [maybeSeparator, newI] = fetchSeparator(code, i);
    if (maybeSeparator !== undefined) {
      if (lexeme.length > 0) {
        lexemes.push(lexeme);
      }
      lexeme = '';
      lexemes.push(maybeSeparator);
      i = newI;

      continue;
    }
    lexeme += char;
  }
  if (lexeme.length > 0) {
    lexemes.push(lexeme);
  }

  return lexemes;
};
exports.parse = parse;

function fetchSeparator(code, i) {
  let maybeSeparator = '';
  let cursor = i;
  for (let j = maxSeparatorSize; j > 0; j--) {
    for (let k = 0; k < j; k++) {
      cursor += k;
      maybeSeparator += code[cursor];
    }
    if (separators.includes(maybeSeparator)) {
      return [maybeSeparator, cursor];
    }
    maybeSeparator = '';
    cursor = i;
  }

  return [];
}
