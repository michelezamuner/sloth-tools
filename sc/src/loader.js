module.exports = class Loader {
  constructor(fs, roots) {
    this._fs = fs;
    this._roots = roots;
  }

  load(ref) {
    const parts = ref.split('.');
    const id = parts.pop();
    const subPath = parts.join('/');

    let path = '';
    for (const root of this._roots) {
      path = root + '/' + subPath + '.sbc';
      if (this._fs.existsSync(path)) {
        break;
      }
    }

    const mod = this._fs.readFileSync(path, 'utf8');

    return { obj: 'fun', type: mod.substr(mod.indexOf(`; ${id}: `) + id.length + 4) };
  }
};
