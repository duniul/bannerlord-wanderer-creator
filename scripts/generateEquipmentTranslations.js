const path = require('path');
const clipboardy = require('clipboardy');
const parseEquipmentNpcs = require('./xml/parseEquipmentNpcs');
const { toEquipmentEnumKey } = require('./utils/equipment');
const { checkBannerlordDir } = require('./utils/filesystem');

const pathArg = process.argv[2];

function toEquipmentNames(npcs) {
  return npcs.reduce(
    (acc, npc) => ({ ...acc, ['[EquipmentTemplate.' + toEquipmentEnumKey(npc.attributes.id) + ']']: npc.attributes.name }),
    {}
  );
}

async function generateEquipmentTranslations() {
  const bannerlordPath = path.resolve(pathArg);
  await checkBannerlordDir(bannerlordPath);

  const npcsEquipments = await parseEquipmentNpcs(bannerlordPath);
  const npcEquipmentNames = toEquipmentNames(npcsEquipments);
  const stringified = JSON.stringify(npcEquipmentNames, null, 2).replace(/"\[/g, '[').replace(/\]"/g, ']');

  await clipboardy.writeSync(stringified);
  console.log(stringified);
  console.log('\n✅ Done! Result has been copied to your clipboard.');
}

generateEquipmentTranslations();
