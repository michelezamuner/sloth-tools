const Client = require('../../../src/clients/inline/client');

describe('inline client', () => {
  it('exec inline program', () => {
    const code = `
      ::_ =
        main = _: ::core::sys::Process -> ::core::sys::Exit.OK
    `;

    const result = Client.exec(code, '::_::main');

    expect(result).toBe(0);
  });
});
