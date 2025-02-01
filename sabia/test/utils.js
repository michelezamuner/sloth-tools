const separator = (min = 1) => {
  const size = Math.random() * 2 + min;
  let s = '';
  for (let i = 0; i < size; i++) {
    s += ' ';
  }

  return s;
};

exports.s = () => separator(1);
exports.z = () => separator(0);
