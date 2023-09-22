const exec = require('child_process').execSync;

describe('lang', () => {
  it('evaluates named relation', () => {
    const code = 'rel a of :b is :c';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe('rel `a`');
  });

  it('evaluates anonymous relation', () => {
    const code = 'rel of :a is :b';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe('rel `#rel_0`');
  });

  it('evaluates multiple expressions', () => {
    const code = 'rel of :a is :b; rel of :c is :d; rel of :e is :f';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe('rel `#rel_2`');
  });

  it('applies named relation', () => {
    const code = 'rel a of :b is :c; a of :b';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe(':c');
  });

  it('applies anonymous relation', () => {
    const code = '(rel of :b is :c) of :b';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe(':c');
  });

  it('applies matching relation', () => {
    const code = '(rel of a is match a in :a is :b, :c is :d) of :c';

    const output = exec(`bin/lang -e '${code}'`);

    expect(output.toString().trim()).toBe(':d');
  });
});
