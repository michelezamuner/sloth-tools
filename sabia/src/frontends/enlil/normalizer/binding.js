const Lexer = require('../lexer');

const parse = lexemes => {
  const result = [];
  let expressions = null;
  let isFunction = false;
  let isFunctionBody = false;
  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];
    if (!isFunction && lexeme === 'fn') {
      isFunction = true;
      expressions = [[]];
      result.push(lexeme);
    } else if (isFunction && lexeme === '{') {
      isFunctionBody = true;
      result.push(lexeme);
    } else if (isFunctionBody && lexeme === '}') {
      isFunctionBody = false;
      isFunction = false;
      let code = '';
      let parenthesis = '';
      for (let j = 0; j < expressions.length; j++) {
        if (j < expressions.length - 1) {
          code += `core::lang::then(${expressions[j].join(' ')},`;
          parenthesis += ')';
        } else {
          code += expressions[j].join(' ');
        }
      }
      code += parenthesis;
      const additions = Lexer.parse(code);
      for (let j = 0; j < additions.length; j++) {
        result.push(additions[j]);
      }
      result.push(lexeme);
    } else if (isFunctionBody && lexeme !== ';') {
      expressions[expressions.length - 1].push(lexeme);
    } else if (isFunctionBody && lexeme === ';') {
      expressions.push([]);
    } else {
      result.push(lexeme);
    }
  }

  return expressions.length > 1 ? result : lexemes;
};
exports.parse = parse;
