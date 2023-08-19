module.exports = class Linker {
  parse(unit) {
    return `
      push_i 0x00 0x06
      jmp_i 0x00 0x0a
      pop a
      exit_r a
      ${this._resolve(unit)}
    `.split('\n').map(l => l.trim()).join('\n').trim();
  }

  _resolve(unit) {
    let resolvedUnit = unit;
    let resolved = false;
    let openIndex = -1;
    while (!resolved) {
      openIndex = unit.indexOf('#{', openIndex + 1);
      if (openIndex === -1) {
        resolved = true;
        break;
      }
      const closeIndex = unit.indexOf('}', openIndex);
      const addr = 10 + +unit.substr(openIndex + 4, closeIndex - openIndex - 4);
      resolvedUnit = unit.substr(0, openIndex) + `0x00 ${this._hex(addr)}` + unit.substr(closeIndex + 1);
    }

    return resolvedUnit;
  }

  _hex(val) {
    return '0x' + ('00' + (+val).toString(16)).slice(-2);
  }
};
