const { getBannerlordXmlPath } = require('../utils/filesystem');
const parseNpcsXml = require('./parseNpcsXml');

const skippedPatterns = {
  spCharacters: [
    'char_creation',
    'player_char',
    'brother',
    'crazy',
    'smith',
    'gangleader',
    'steward',
    'ransom_broker',
    'dummy',
    'practice',
    'militia',
    'duel',
    'for_perf',
    'caravan',
    'village',
    'tournament',
    'xerina',
    'kradus',
    'dranton',
    'female',
    'beggar',
    'merchant',
    'armorer',
    'tavern',
    'musician',
    'towns',
    'rural',
    'worker',
    'prison',
    'guard_',
    'preacher',
    'artisan',
    'preacher',
    'borrowed',
    'unarmed',
    'shop_keeper',
    '_fighter',
    'test',
    'disguised',
    'coop',
    '^horseman$',
    '^horse_archer$',
  ],
  spCharacterTemplates: ['test', 'troop_civilian', 'creation', 'guard'],
};

async function parseEquipmentNpcs(bannerlordPath) {
  const npcsPath = getBannerlordXmlPath(bannerlordPath, 'spNpcs');
  const npcTemplatesPath = getBannerlordXmlPath(bannerlordPath, 'spNpcTemplates');
  const banditsPath = getBannerlordXmlPath(bannerlordPath, 'bandits');

  const npcsAndTroops = parseNpcsXml(npcsPath, skippedPatterns.spCharacters);
  const npcTemplates = parseNpcsXml(npcTemplatesPath, skippedPatterns.spCharacterTemplates, true);
  const bandits = parseNpcsXml(banditsPath);

  return (await Promise.all([npcsAndTroops, bandits, npcTemplates])).flatMap((v) => v);
}

module.exports = parseEquipmentNpcs;
