exports.debug = {
  elem: 'type',
  name: 'core::lang::Fun',
  params: [
    {elem: 'type', name: '<T>', params: []},
    {elem: 'type', name: '<T>', params: []},
  ],
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
