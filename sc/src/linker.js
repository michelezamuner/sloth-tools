module.exports = class Linker {
  parse(unit) {
    if (unit.indexOf('; _') !== -1) {
      return `
        push_i 0x00 0x06
        jmp_i 0x00 0x0a
        pop a
        exit_r a
        ${this._resolve(unit)}
      `.split('\n').map(l => l.trim()).join('\n').trim();
    }

    return unit;
  }

  _resolve(unit) {
    const refMap = {};
    let addr = 0;
    for (const line of unit.split('\n')) {
      if (line.startsWith(';')) {
        refMap[line.substr(2)] = addr;

        continue;
      }
      addr += line.split(' ').length + (line.indexOf('#{') === -1 ? 0 : 1);
    }

    let resolvedUnit = unit;
    let resolved = false;
    let openIndex = -1;
    while (!resolved) {
      openIndex = resolvedUnit.indexOf('#{', openIndex + 1);
      if (openIndex === -1) {
        resolved = true;
        break;
      }
      const closeIndex = resolvedUnit.indexOf('}', openIndex);
      const tag = resolvedUnit.substr(openIndex, closeIndex - openIndex + 1);
      const match = tag.match(/#\{([^+]+)(\+(.+))?\}/);
      const ref = match[1];
      const refAddr = refMap[ref];
      const addr = 10 + refAddr + (match[2] ? +match[2] : 0);
      resolvedUnit = resolvedUnit.substr(0, openIndex) + `0x00 ${this._hex(addr)}` + resolvedUnit.substr(closeIndex + 1);
    }

    return resolvedUnit;
  }

  _hex(val) {
    return '0x' + ('00' + (+val).toString(16)).slice(-2);
  }
};
