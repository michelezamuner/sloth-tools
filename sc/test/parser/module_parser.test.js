const ModuleParser = require('../../src/parser/module_parser');

describe('module parser', () => {
  let parser = null;
  const innerParser = { parse: () => {}};

  beforeEach(() => {
    parser = new ModuleParser(innerParser);
  });

  it('parses module with single definition', () => {
    const lexemes = ['v', ':=', 'a', 'b', 'c'];
    innerParser.parse = _l => JSON.stringify(_l) === JSON.stringify(['a', 'b', 'c']) ? 'ast' : null;

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ 'v': 'ast' });
  });

  it('parses module with multiple definitions', () => {
    const lexemes = ['u', ':=', '0', 'v', ':=', '1', 'z', ':=', '2'];
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

  it('parses module with single type definition', () => {
    const lexemes = ['n', '::', 'std.num'];

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ 'n': { obj: 'type', type: 'std.num' } });
  });

  it('parses module with multiple type definitions', () => {
    const lexemes = ['a', '::', 'b', 'c', '::', 'd'];

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'a': { obj: 'type', type: 'b' },
      'c': { obj: 'type', type: 'd' },
    });
  });

  it('parses module with type application', () => {
    const lexemes = ['f', ':', 'n', 'n', '->', 'n', ':=', 'a', 'b', '->', 'c'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b', '->', 'c'])) return { obj: 'ast' };
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'f': { obj: 'ast', type: 'n n -> n' },
    });
  });

  it('parses module with multiple type applications', () => {
    const lexemes = ['f', ':', 'n', 'n', '->', 'n', ':=', 'a', 'b', '->', 'c', 'g', ':', 'm', 'm', '->', 'm', ':=', 'd', 'e', '->', 'f'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b', '->', 'c'])) return { obj: 'ast1' };
      if (JSON.stringify(_l) === JSON.stringify(['d', 'e', '->', 'f'])) return { obj: 'ast2' };
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'f': { obj: 'ast1', type: 'n n -> n' },
      'g': { obj: 'ast2', type: 'm m -> m' },
    });
  });

  it('parses module with type definitions and type applications', () => {
    const lexemes = ['t1', '::', 't0', 'v', ':', 'n', ':=', '0', 't3', '::', 't2', 'w', ':=', 'a', 'b'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['0'])) return { obj: 'ast1' };
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b'])) return 'ast2';
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      't1': { obj: 'type', type: 't0' },
      'v': { obj: 'ast1', type: 'n' },
      't3': { obj: 'type', type: 't2' },
      'w': 'ast2',
    });
  });
});
