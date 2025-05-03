const Inline = require('../../src/clients/inline');

describe('inline client', () => {
  it('test', () => {
    const code = `
      ::_ =
        main = _: ::core::sys::Process -> ::core::sys::Exit.OK
    `;

    const result = Inline.exec(code, '::_::main');

    expect(result).toBe(0);
  });
});
