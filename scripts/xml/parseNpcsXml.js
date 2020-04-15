const convert = require('xml-js');
const path = require('path');
const fsPromise = require('fs').promises;
const { capitalize } = require('lodash');

const translationIdRegEx = /^{[^}]*}/;

function filterNpcByPattern(npc, filterRegEx) {
  const { id } = npc.attributes;

  if (!id) {
    return false;
  }

  if (filterRegEx.test(id)) {
    return false;
  }

  return true;
}

function removeTranslationId(npcElement) {
  if (!npcElement.attributes.name) {
    return npcElement;
  }

  const updated = { ...npcElement };
  updated.attributes.name = updated.attributes.name.replace(translationIdRegEx, '');
  return updated;
}

function extendWandererEquipmentName({ id, name }) {
  const culture = /aserai|battania|empire|khuzait|sturgia|vlandia/.exec(id);
  const armed = id.includes('armed');
  const type = /companion|wanderer/.exec(id);

  let newName = name;

  if (type) {
    newName = type[0] + '_equipment';
  }

  if (armed) {
    newName = 'armed_' + newName;
  }

  if (culture) {
    newName = culture[0] + '_' + newName;
  }

  return newName;
}

function formatTemplateNames(npc) {
  const { id } = npc.attributes;

  let newName = id;

  if (newName === 'wanderer_equipment') {
    newName = extendWandererEquipmentName(npc.attributes);
  }

  newName = newName
    .replace('template_', '')
    .replace(/civillian|noncombatant/, 'civilian')
    .replace(/tier(\d)/, 'Tier $1')
    .replace('lord_lady', 'noble')
    .replace('battania', 'battanian')
    .replace('sturgia', 'sturgian')
    .replace('empire', 'imperial')
    .replace('vlandia', 'vlandian')
    .replace('npc_', '')
    .split('_')
    .map(capitalize)
    .join(' ');

  return { ...npc, attributes: { ...npc.attributes, name: newName } };
}

async function parseNpcsXml(xmlPath, patternsToSkip, shouldFormatNames = false) {
  const xmlFile = await fsPromise.readFile(path.resolve(xmlPath), { encoding: 'utf8' });

  const jsonResult = convert.xml2js(xmlFile);
  let npcCharacterElements = jsonResult.elements[0].elements.filter((e) => e.name === 'NPCCharacter');

  if (patternsToSkip) {
    const idFilterRegEx = new RegExp(patternsToSkip.join('|'), 'i');
    npcCharacterElements = npcCharacterElements.filter((el) => filterNpcByPattern(el, idFilterRegEx));
  }

  const npcCharacters = npcCharacterElements.map(removeTranslationId).filter((npc) => npc.attributes.name);

  if (shouldFormatNames) {
    return npcCharacters.map(formatTemplateNames);
  }

  return npcCharacters;
}

module.exports = parseNpcsXml;
