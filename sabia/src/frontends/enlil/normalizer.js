const Script = require('./normalizer/script');
const Alias = require('./normalizer/alias');
const Binding = require('./normalizer/binding');
const Debug = require('./normalizer/debug');

const parse = (lexemes, config) => {
  lexemes = Script.parse(lexemes, config);
  lexemes = Alias.parse(lexemes);
  lexemes = Binding.parse(lexemes);
  lexemes = Debug.parse(lexemes);

  return lexemes;
};
exports.parse = parse;
