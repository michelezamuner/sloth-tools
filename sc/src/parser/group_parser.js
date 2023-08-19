module.exports = class GroupParser {
  constructor(innerParser) {
    this._innerParser = innerParser;
  }

  parse(lexemes, layers = [[]]) {
    let layerLevel = 0;

    for (const l of lexemes) {
      if (l === '(') {
        layers.push([]);
        layerLevel++;

        continue;
      }

      if (l === ')') {
        layerLevel--;
        const ast = this._innerParser.parse(layers.pop(), layers);
        layers[layerLevel].push(ast);

        continue;
      }

      layers[layerLevel].push(l);
    }

    return this._innerParser.parse(layers.pop(), layers);
  }
};
