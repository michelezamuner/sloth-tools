const GroupParser = require('../src/group_parser');

describe('group parser', () => {
  let parser = null;
  const innerParser = {};

  beforeEach(() => {
    parser = new GroupParser(innerParser);
  });

  it('parses code with no nestings', () => {
    const lexemes = ['a'];
    innerParser.parse = _l => JSON.stringify(_l) === JSON.stringify(lexemes) ? 'ast' : null;

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual('ast');
  });

  it('parses code with nestings', () => {
    const lexemes = ['f', '(', 'a', 'b', ')'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b'])) return 'ast1';
      if (JSON.stringify(_l) === JSON.stringify(['f', 'ast1'])) return 'ast2';
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual('ast2');
  });

  it('parses code with multiple levels of nestings', () => {
    const lexemes = ['f', '(', 'a', '(', 'b', 'c', ')', ')'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['b', 'c'])) return 'ast1';
      if (JSON.stringify(_l) === JSON.stringify(['a', 'ast1'])) return 'ast2';
      if (JSON.stringify(_l) === JSON.stringify(['f', 'ast2'])) return 'ast3';

      const result = parser.parse(lexemes);

      expect(result).toStrictEqual('ast3');
    };
  });
});
