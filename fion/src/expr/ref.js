const natives = require('./natives.json');

exports.create = ref => {
  if (ref === ref.toUpperCase() && !natives.includes(ref)) {
    throw `Invalid native reference '${ref}'`;
  }

  return { ref: ref };
};
