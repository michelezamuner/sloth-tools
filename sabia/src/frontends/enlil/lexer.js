const symbolSeparators = ['::', '(', ')', ',', '|', ':', '->', '{', '}', '=', ';'];
const wordSeparators = ['enum', 'const', 'fn', 'mod', 'alias'];

const parse = code => {
  const lexemes = [];
  let lexeme = [];

  const chars = code.trim().split('');
  for (let i = 0; i < chars.length; i++) {
    const prev = chars[i - 1] || '';
    const char = chars[i];
    const next = chars[i + 1];
    const next2 = chars[i + 2];
    const next3 = chars[i + 3];
    const next4 = chars[i + 4];
    const next5 = chars[i + 5];
    if (char.trim() === '') {
      continue;
    }

    if (char.trim() !== '') {
      const separator = findSeparator(prev, char, next, next2, next3, next4, next5);

      if (separator !== null) {
        if (lexeme.length) {
          lexemes.push(lexeme.join(''));
        }
        lexemes.push(separator);
        i += separator.length - 1;
        lexeme = [];
      }

      if (separator === null) {
        lexeme.push(char);
      }
    }
  }

  if (lexeme.length) {
    lexemes.push(lexeme.join(''));
  }

  return lexemes;
};
exports.parse = parse;

const findSeparator = (prev, char, next, next2, next3, next4, next5) => {
  let sep = symbolSeparator(char, next);
  if (sep) {
    return sep;
  }

  sep = wordSeparator(prev, char, next, next2, next3, next4, next5);
  if (sep) {
    return sep;
  }

  return null;
};

const symbolSeparator = (char, next) => {
  if (symbolSeparators.includes(`${char}${next}`)) {
    return `${char}${next}`;
  }

  if (symbolSeparators.includes(char)) {
    return char;
  }

  return null;
};

const wordSeparator = (prev, char, next, next2, next3, next4, next5) => {
  if (wordSeparators.includes(`${char}${next}${next2}${next3}${next4}`) && isWordSeparated(prev, next5)) {
    return `${char}${next}${next2}${next3}${next4}`;
  }

  if (wordSeparators.includes(`${char}${next}${next2}${next3}`) && isWordSeparated(prev, next4)) {
    return `${char}${next}${next2}${next3}`;
  }

  if (wordSeparators.includes(`${char}${next}${next2}`) && isWordSeparated(prev, next3)) {
    return `${char}${next}${next2}`;
  }

  if (wordSeparators.includes(`${char}${next}`) && isWordSeparated(prev, next2)) {
    return `${char}${next}`;
  }

  if (wordSeparators.includes(char) && isWordSeparated(prev, next)) {
    return char;
  }

  return null;
};

const isWordSeparated = (prev, next) => {
  const separators = ['', ...symbolSeparators];

  return separators.includes(prev.trim()) && separators.includes(next.trim());
};
