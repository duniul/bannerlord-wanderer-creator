const { capitalize } = require('lodash');

function toEquipmentEnumKey(id) {
  let key = id.replace(/civillian|noncombatant/, 'civilian').replace('lord_lady', 'noble');

  if (key.includes('template')) {
    key = 'template_' + key.replace('template_', '');
  }

  return key.split('_').map(capitalize).join('');
}

module.exports = {
  toEquipmentEnumKey,
};
