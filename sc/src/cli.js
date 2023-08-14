const fs = require('fs');

module.exports = class Client {
  constructor() {
    this._filters = [];
  }

  pipe(filter) {
    this._filters.push(filter);
  }

  run() {
    const programFile = process.argv[2];
    const program = fs.readFileSync(programFile, 'utf-8');

    let data = program;
    for (const filter of this._filters) {
      data = filter.parse(data);
    }

    fs.writeFileSync('out.sbc', data, 'utf-8');
  }
};
