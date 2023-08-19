const ModuleParser = require('../../src/parser/module_parser');

describe('module parser', () => {
  let parser = null;
  const innerParser = {};

  beforeEach(() => {
    parser = new ModuleParser(innerParser);
  });

  it('parses module with single definition', () => {
    const lexemes = ['v', ':', '0'];
    innerParser.parse = _l => JSON.stringify(_l) === JSON.stringify(['0']) ? 'ast' : null;

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ 'v': 'ast' });
  });

  it('parses module with multiple definitions', () => {
    const lexemes = ['u', ':', '0', 'v', ':', '1', 'z', ':', '2'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['0'])) return 'ast0';
      if (JSON.stringify(_l) === JSON.stringify(['1'])) return 'ast1';
      if (JSON.stringify(_l) === JSON.stringify(['2'])) return 'ast2';
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'u': 'ast0',
      'v': 'ast1',
      'z': 'ast2',
    });
  });
});
