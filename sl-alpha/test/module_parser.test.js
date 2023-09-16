const ModuleParser = require('../src/module_parser');

describe('module parser', () => {
  let parser = null;
  const innerParser = { parse: () => {}};

  beforeEach(() => {
    parser = new ModuleParser(innerParser);
  });

  it('parses single definition', () => {
    const lexemes = ['v', ':=', 'a', 'b', 'c'];
    innerParser.parse = _l => JSON.stringify(_l) === JSON.stringify(['a', 'b', 'c']) ? 'ast' : null;

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ 'v': 'ast' });
  });

  it('parses multiple definitions', () => {
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

  it('parses single type application', () => {
    const lexemes = ['f', ':', 'n', 'n', '->', 'n', ':=', 'a', 'b', '->', 'c'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b', '->', 'c'])) return { obj: 'ast' };
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'f': { obj: 'ast', type: 'n n -> n' },
    });
  });

  it('parses multiple type applications', () => {
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

  it('parses definitions where only some have type applications', () => {
    const lexemes = ['v', ':', 'n', ':=', '0', 'w', ':=', '1', 'f', ':', 'n', 'n', '->', 'n', ':=', 'a', 'b', '->', 'c'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['0'])) return { obj: 'ast1' };
      if (JSON.stringify(_l) === JSON.stringify(['1'])) return 'ast2';
      if (JSON.stringify(_l) === JSON.stringify(['a', 'b', '->', 'c'])) return { obj: 'ast3' };
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'v': { obj: 'ast1', type: 'n' },
      'w': 'ast2',
      'f': { obj: 'ast3', type: 'n n -> n' },
    });
  });

  it('parses type definitions', () => {
    const lexemes = ['T', ':=', 'V'];

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ 'T': 'V' });
  });

  it('parses type definitions and value definitions', () => {
    const lexemes = ['T', ':=', 'V', 'v', ':=', '0', 'w', ':', 'T', ':=', '1'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['0'])) return 'ast1';
      if (JSON.stringify(_l) === JSON.stringify(['1'])) return { obj: 'ast2' };
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'T': 'V',
      'v': 'ast1',
      'w': { obj: 'ast2', type: 'T' },
    });
  });

  it('parses underscore as a function', () => {
    const lexemes = ['_', ':=', '_', '_', '->', '0'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['_', '_', '->', '0'])) return 'ast';
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({ '_': 'ast' });
  });

  it('parses aliases', () => {
    const lexemes = ['a', '::', 'b', 'c', '::', 'd', 'f', ':=', '_', '_', '->', 'a', 'c'];
    innerParser.parse = _l => {
      if (JSON.stringify(_l) === JSON.stringify(['_', '_', '->', 'b', 'd'])) return 'ast';
    };

    const result = parser.parse(lexemes);

    expect(result).toStrictEqual({
      'f' : 'ast',
    });
  });
});
