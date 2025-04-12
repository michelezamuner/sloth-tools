exports.debug = {
  elem: 'type',
  var: 'fun',
  args: [{ elem: 'type', var: 'gen', gen: '<T>' }],
  ret: { elem: 'type', var: 'gen', gen: '<T>' },
};

exports.then = {
  elem: 'type',
  var: 'fun',
  args: [
    { elem: 'type', var: 'gen', gen: '<T>' },
    { elem: 'type', var: 'gen', gen: '<U>' },
  ],
  ret: { elem: 'type', var: 'gen', gen: '<U>' },
};
