const tokenize = require('./tokenizer').tokenize;
const parse = require('./parser').parse;
const run = require('./interpreter').run;

const code = process.argv[3];
const tokens = tokenize(code);
const ast = parse(tokens);
const output = run(ast);

console.log(output);
