const path = require('path');
const clipboardy = require('clipboardy');
const parseEquipmentNpcs = require('./xml/parseEquipmentNpcs');
const { toEquipmentEnumKey } = require('./utils/equipment');
const { checkBannerlordDir } = require('./utils/filesystem');

const pathArg = process.argv[2];

function toEnumString(npcs, enumName) {
  const enumKeyValuePairs = npcs.map((npc) => [toEquipmentEnumKey(npc.attributes.id), npc.attributes.id]);

  return `
export enum ${enumName} {
${enumKeyValuePairs.map(([key, value]) => `  ${key} = '${value}',\n`).join('')}}
`;
}

function filterBattleEquipment(npcs) {
  return npcs.filter((npc) => {
    const equipmentSets = npc.elements.filter((el) => el.name === 'equipmentSet');
    return equipmentSets.some((es) => !es.attributes || !es.attributes.civilian);
  });
}

function filterCivilianEquipment(npcs) {
  return npcs.filter((npc) => {
    const equipmentSets = npc.elements.filter((el) => el.name === 'equipmentSet');
    return equipmentSets.some((es) => es.attributes && es.attributes.civilian === 'true');
  });
}

async function generateEquipmentEnums() {
  const bannerlordPath = path.resolve(pathArg);
  await checkBannerlordDir(bannerlordPath);

  const npcsEquipment = await parseEquipmentNpcs(bannerlordPath);
  const npcsBattleEquipment = filterBattleEquipment(npcsEquipment);
  const npcsCivilianEquipment = filterCivilianEquipment(npcsEquipment);
  const battleEnumString = toEnumString(npcsBattleEquipment, 'BattleEquipmentTemplate');
  const civilianEnumString = toEnumString(npcsCivilianEquipment, 'CivilianEquipmentTemplate');
  const fullString = `${battleEnumString}${civilianEnumString}`;

  await clipboardy.writeSync(fullString);
  console.log(fullString);
  console.log('\n✅ Done! Result has been copied to your clipboard.');
}

generateEquipmentEnums();
