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
  name: 'core::lang::Fun',
  params: [
    { elem: 'type', name: '<T>', params: [] },
    {
      elem: 'type',
      name: 'core::lang::Fun',
      params: [
        { elem: 'type', name: '<T>', params: [] },
        { elem: 'type', name: '<U>', params: [] },
      ],
    },
  ],
};
