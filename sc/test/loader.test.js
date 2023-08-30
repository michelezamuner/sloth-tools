const Loader = require('../src/loader');

describe('loader', () => {
  let loader = null;
  const fs = {};
  const paths = ['/path/to/lib'];

  beforeEach(() => {
    loader = new Loader(fs, paths);
  });

  it('loads given reference from compiled module', () => {
    const mod = '; add: std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8';
    fs.existsSync = path => path === '/path/to/lib/std/uint8.sbc';
    fs.readFileSync = path => path === '/path/to/lib/std/uint8.sbc' ? mod : null;

    const result = loader.load('std.uint8.add');

    expect(result).toStrictEqual({ obj: 'fun', type: 'std.uint8.UInt8 std.uint8.UInt8 -> std.uint8.UInt8' });
  });
});
