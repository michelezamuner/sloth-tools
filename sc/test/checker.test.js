const Checker = require('../src/checker');

describe('checker', () => {
  let checker = null;
  const loader = {};

  beforeEach(() => {
    checker = new Checker(loader);
  });

  it('checks uint8 value', () => {
    const ast = { obj: 'val', val: '255' };

    const result = checker.parse(ast);

    expect(result).toStrictEqual({ obj: 'val', val: '255', type: 'std.uint8.UInt8' });
  });

  it('checks uint16 value', () => {
    const ast = { obj: 'val', val: '256' };

    const result = checker.parse(ast);

    expect(result).toStrictEqual({ obj: 'val', val: '256', type: 'std.uint16.UInt16' });
  });

  it('checks local reference', () => {
    const ast = {
      'r': { obj: 'ref', ref: 's' },
      's': { obj: 'val', val: '0' },
    };

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      'r': { obj: 'ref', ref: 's', type: 'std.uint8.UInt8' },
      's': { obj: 'val', val: '0', type: 'std.uint8.UInt8' },
    });
  });

  it('checks external reference', () => {
    const ast = {
      'f': { obj: 'ref', ref: 'std.uint8.add' },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      'f': { obj: 'ref', ref: 'std.uint8.add', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' },
    });
  });

  it('checks expression', () => {
    const ast = {
      'e': {
        obj: 'expr',
        fun: { obj: 'ref', ref: 'std.uint8.add' },
        args: [
          { obj: 'ref', ref: 'a' },
          { obj: 'ref', ref: 'b' },
        ],
      },
      'a': { obj: 'val', val: '0' },
      'b': { obj: 'val', val: '0' },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      'e': {
        obj: 'expr',
        type: 'std.uint8.UInt8',
        fun: { obj: 'ref', ref: 'std.uint8.add', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' },
        args: [
          { obj: 'ref', ref: 'a', type: 'std.uint8.UInt8' },
          { obj: 'ref', ref: 'b', type: 'std.uint8.UInt8' },
        ],
      },
      'a': { obj: 'val', val: '0', type: 'std.uint8.UInt8' },
      'b': { obj: 'val', val: '0', type: 'std.uint8.UInt8' },
    });
  });

  it('checks expression with wrong argument type', () => {
    const ast = {
      'e': {
        obj: 'expr',
        fun: { obj: 'ref', ref: 'std.uint8.add' },
        args: [
          { obj: 'ref', ref: 'a' },
          { obj: 'ref', ref: 'b' },
        ],
      },
      'a': { obj: 'val', val: '256' },
      'b': { obj: 'val', val: '0' },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    expect(() => checker.parse(ast)).toThrow('Argument 0 of function std.uint8.add has type std.uint16.UInt16 instead of std.uint8.UInt8');
  });

  it('checks function not using arguments', () => {
    const ast = {
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_'},
          { obj: 'arg', arg: '_'},
        ],
        body: {
          obj: 'expr',
          fun: { obj: 'ref', ref: 'std.uint8.add' },
          args: [
            { obj: 'val', val: '0' },
            { obj: 'val', val: '0' },
          ],
        },
      },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      '_': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: '_'},
          { obj: 'arg', arg: '_'},
        ],
        body: {
          obj: 'expr',
          type: 'std.uint8.UInt8',
          fun: { obj: 'ref', ref: 'std.uint8.add', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' },
          args: [
            { obj: 'val', val: '0', type: 'std.uint8.UInt8'},
            { obj: 'val', val: '0', type: 'std.uint8.UInt8'},
          ],
        },
      },
    });
  });

  it('checks untyped function using arguments', () => {
    const ast = {
      'f': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'a' },
          { obj: 'arg', arg: 'b' },
        ],
        body: {
          obj: 'expr',
          fun: { obj: 'ref', ref: 'std.uint8.add' },
          args: [
            { obj: 'ref', ref: 'a' },
            { obj: 'ref', ref: 'b' },
          ],
        },
      },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      'f': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'a' },
          { obj: 'arg', arg: 'b' },
        ],
        body: {
          obj: 'expr',
          type: 'std.uint8.UInt8',
          fun: { obj: 'ref', ref: 'std.uint8.add', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' },
          args: [
            { obj: 'ref', ref: 'a' },
            { obj: 'ref', ref: 'b' },
          ],
        },
      },
    });
  });

  it('checks expression of untyped local function', () => {
    const ast = {
      'e': {
        obj: 'expr',
        fun: { obj: 'ref', ref: 'f' },
        args: [
          { obj: 'val', val: '1' },
          { obj: 'val', val: '3' },
        ],
      },
      'f': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'a' },
          { obj: 'arg', arg: 'b' },
        ],
        body: {
          obj: 'expr',
          fun: { obj: 'ref', ref: 'std.uint8.add' },
          args: [
            { obj: 'ref', ref: 'a' },
            { obj: 'ref', ref: 'b' },
          ],
        },
      },
    };
    loader.load = r => r === 'std.uint8.add' ? { obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' } : null;

    const result = checker.parse(ast);

    expect(result).toStrictEqual({
      'e': {
        obj: 'expr',
        fun: { obj: 'ref', ref: 'f' },
        args: [
          { obj: 'val', val: '1' },
          { obj: 'val', val: '3' },
        ],
      },
      'f': {
        obj: 'fun',
        args: [
          { obj: 'arg', arg: 'a' },
          { obj: 'arg', arg: 'b' },
        ],
        body: {
          obj: 'expr',
          type: 'std.uint8.UInt8',
          fun: { obj: 'ref', ref: 'std.uint8.add', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' },
          args: [
            { obj: 'ref', ref: 'a' },
            { obj: 'ref', ref: 'b' },
          ],
        },
      },
    });
  });
});
