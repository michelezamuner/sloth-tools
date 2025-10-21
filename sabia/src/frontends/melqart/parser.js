const parse = lexemes => {
  return {
    elem: 'exp',
    var: 'enum',
    type: { elem: 'type', var: 'id', id: 'T' },
    body: { elem: 'cons', id: 'A' },
  };
};

exports.parse = parse;
