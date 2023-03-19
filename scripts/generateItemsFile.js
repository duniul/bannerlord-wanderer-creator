/**
 * Generates up-to-date item objects in items.ts by parsing the Bannerlord XMLs.
 */

const path = require('path');
const fs = require('fs-extra');
const { orderBy } = require('natural-orderby');
const { verifyTempSourceDirs, tempSourceDirs } = require('./helpers/bannerlordFiles');
const { parseXmlToJs } = require('./helpers/xmlParser');
const { stripTranslationId } = require('./helpers/translations');

const ITEMS_FILE_PATH = 'src/constants/items.ts';
const ABSOLUTE_ITEMS_FILE_PATH = path.resolve(__dirname, `../${ITEMS_FILE_PATH}`);

verifyTempSourceDirs();

const itemsSourceDir = path.resolve(tempSourceDirs.sandBoxCoreData, 'items');
const itemsSourceFiles = fs
  .readdirSync(itemsSourceDir)
  .filter((fileName) => !fileName.includes('tournament')) // skip tournament weapons
  .map((fileName) => path.resolve(itemsSourceDir, fileName));

const ITEM_GROUPS = {
  HEAD_ARMORS: [],
  CAPES: [],
  BODY_ARMORS: [],
  HAND_ARMORS: [],
  LEG_ARMORS: [],
  MOUNTS: [],
  MOUNT_HARNESSES: [],
  WEAPONS: [],
};

const weaponTypes = new Set(['OneHandedWeapon', 'Polearm', 'Bow', 'Crossbow', 'Arrows', 'Bolts', 'Thrown', 'Shield']);

function getItemGroup(xmlItem) {
  const { Type, crafting_template } = xmlItem._attrs;

  // Only weapons have crafting templates
  if (!!crafting_template || weaponTypes.has(Type)) {
    return ITEM_GROUPS.WEAPONS;
  }

  switch (Type) {
    case 'HeadArmor':
      return ITEM_GROUPS.HEAD_ARMORS;
    case 'Cape':
      return ITEM_GROUPS.CAPES;
    case 'BodyArmor':
      return ITEM_GROUPS.BODY_ARMORS;
    case 'HandArmor':
      return ITEM_GROUPS.HAND_ARMORS;
    case 'LegArmor':
      return ITEM_GROUPS.LEG_ARMORS;
    case 'Horse':
      return ITEM_GROUPS.MOUNTS;
    case 'HorseHarness':
      return ITEM_GROUPS.MOUNT_HARNESSES;
    default:
      return;
  }
}

function shouldIgnoreItem(xmlItem) {
  const { id } = xmlItem._attrs;

  if (id.includes('_unmountable') || id.includes('_tournament')) {
    return false;
  }

  return true;
}

function storeXmlItem(xmlItem) {
  const group = getItemGroup(xmlItem);

  if (!shouldIgnoreItem(xmlItem)) {
    return;
  }

  if (group) {
    const { id, name } = xmlItem._attrs;
    const item = { id, name: stripTranslationId(name) };

    // Since there is no easy way determine if crafted weapons are civilian,
    // we ignore the civilian status of weapons and only set it for armors
    if (group !== ITEM_GROUPS.WEAPONS && xmlItem.Flags?._attrs?.Civilian) {
      item.civilian = true;
    }

    group.push(item);
  }
}

function storeXmlItems(xmlItems) {
  if (!xmlItems) {
    return;
  }

  if (Array.isArray(xmlItems)) {
    Object.entries(ITEM_GROUPS)
      .map(([groupName, group]) => {
        return (
          `export const ${groupName}: Record<string, Item> = {\n` +
          group
            .map(
              (item) =>
                `  ${item.id}: { id: "${item.id}", name: "${item.name}"${item.civilian ? ', civilian: true ' : ''} },`
            )
            .join('\n') +
          '\n};\n'
        );
      })
      .join('\n');
    xmlItems.forEach(storeXmlItem);
  } else {
    storeXmlItem(xmlItems);
  }
}

function writeItemsFile() {
  const scriptName = path.basename(__filename);

  const fileContent =
    '// ATTENTION!\n' +
    `// This file is generated via the script ${scriptName} and should not be edited manually.\n` +
    `// All item objects are sorted by name.\n` +
    '\n' +
    'export type Item = { id: string; name: string; civilian?: boolean };\n' +
    '\n' +
    Object.entries(ITEM_GROUPS)
      .map(([groupName, group]) => {
        const sortedGroup = orderBy(group, (item) => item.name, 'asc');
        return (
          `export const ${groupName}: Record<string, Item> = {\n` +
          sortedGroup
            .map(
              (item) =>
                `  ${item.id}: { id: "${item.id}", name: "${item.name}"${item.civilian ? ', civilian: true ' : ''} },`
            )
            .join('\n') +
          '\n};\n'
        );
      })
      .join('\n');

  fs.ensureDirSync(path.dirname(ABSOLUTE_ITEMS_FILE_PATH));
  fs.writeFileSync(ABSOLUTE_ITEMS_FILE_PATH, fileContent);
}

for (const xmlFile of itemsSourceFiles) {
  const xml = fs.readFileSync(xmlFile).toString();
  const parsed = parseXmlToJs(xml);

  storeXmlItems(parsed.Items.Item);
  storeXmlItems(parsed.Items.CraftedItem);
}

writeItemsFile();

console.log(`✅ Generated items and updated: ${ITEMS_FILE_PATH}`);
console.log(
  Object.entries(ITEM_GROUPS)
    .map(([key, value]) => `  - ${key}: ${value.length}`)
    .join('\n')
);
