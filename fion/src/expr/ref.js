const natives = require('./natives.json');

exports.create = ref => {
  // @todo: this prevents regular references from being uppercase
  if (ref === ref.toUpperCase() && !natives.includes(ref)) {
    throw `Invalid native reference '${ref}'`;
  }

  return { ref: ref };
};
