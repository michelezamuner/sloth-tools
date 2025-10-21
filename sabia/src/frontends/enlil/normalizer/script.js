const Lexer = require('../lexer');

const parse = (lexemes, config) => {
  if (lexemes[0] === 'mod') {
    return lexemes;
  }

  const defs = [];
  const exps = [[]];
  let maybeExp = false;
  for (let i = 0; i < lexemes.length; i++) {
    const lexeme = lexemes[i];
    const def = defs[defs.length - 1];
    if (lexeme === 'enum') {
      if (maybeExp === true && exps[exps.length - 1].length) {
        exps.push([]);
      }
      maybeExp = false;
      defs.push({ type: 'enum', lexemes: [lexeme] });
    } else if (def.type === 'enum' && lexeme === '}') {
      def.lexemes.push(lexeme);
      maybeExp = true;
    } else if (lexeme === 'const') {
      if (maybeExp === true && exps[exps.length - 1].length) {
        exps.push([]);
      }
      maybeExp = false;
      defs.push({ type: 'const', lexemes: [lexeme] });
    } else if (def.type === 'const' && lexeme === ';') {
      def.lexemes.push(lexeme);
      maybeExp = true;
    } else if (lexeme === 'fn') {
      if (maybeExp === true && exps[exps.length - 1].length) {
        exps.push([]);
      }
      maybeExp = false;
      defs.push({ type: 'fun', lexemes: [lexeme] });
    } else if (def.type === 'fun' && lexeme === '}') {
      def.lexemes.push(lexeme);
      maybeExp = true;
    } else if (maybeExp === true) {
      exps[exps.length - 1].push(lexeme);
    } else if (['enum', 'const', 'fun'].includes(def.type)) {
      def.lexemes.push(lexeme);
    }
  }

  let code = `mod ${config.mod} {
    alias core::sys::{ Exit, Exit::OK, Process };
  `;
  for (const def of defs) {
    code += def.lexemes.join(' ');
  }
  code += `fn ${config.main}(${config.proc}: Process) -> Exit {`;
  for (const exp of exps) {
    code += `dbg!(${exp.join(' ')});`;
  }
  code += 'OK } }';

  return Lexer.parse(code);
};
exports.parse = parse;
