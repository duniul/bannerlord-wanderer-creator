import JSZip from 'jszip';
import { Wanderer } from '../types/wanderers';
import { createCharactersXml } from './xml/createCharactersXml';
import { createWandererStringsXml } from './xml/createWandererStringsXml';
import { createSubModuleXml } from './xml/subModuleXml';

function stripNonAlphanumeric(string: string): string {
  return string.replace(/[^a-zA-Z\d]/g, '');
}

function updateWandererIds(modId: string, wanderers: Wanderer[]) {
  const ids = new Set();
  const idPrefix = `spc_wanderer_${modId.toLowerCase()}`;

  return wanderers.map((wanderer) => {
    const namePart = wanderer.name.toLowerCase().replace(' ', '_');
    const baseId = stripNonAlphanumeric(`${idPrefix}_${namePart}`);
    let id = baseId;
    let duplicateIncrement = 1;

    while (ids.has(id)) {
      id = `${baseId}_${duplicateIncrement++}`;
    }

    ids.add(id);
    return { ...wanderer, id };
  });
}

function createXmlAttrsToIdentifyText(modId: string, charactersFilePath: string, stringsFilePath: string) {
  const lines = [];
  lines.push(`${charactersFilePath}: NPCCharacters.NPCCharacter.name`);
  lines.push(`${stringsFilePath}: base.strings.string.text`);
  return lines.join('\n');
}

async function createMod(name: string, version: string, wanderers: Wanderer[], wandererStringsDll: Blob) {
  const id = stripNonAlphanumeric(`zz${name}`);
  const lowerCaseModId = id.toLowerCase();
  const wanderersWithFixedIds = updateWandererIds(id, wanderers);

  const wandererStringsDllPath = `${id}/bin/Win64_Shipping_Client/WandererStringsLoader.dll`;
  const charactersFilePath = `${id}/ModuleData/spspecialcharacters_${lowerCaseModId}.xml`;
  const stringsFilePath = `${id}/ModuleData/wanderer_strings_${lowerCaseModId}.xml`;
  const xmlAttrsToIdentifyPath = `${id}/ModuleData/xml_attributes_to_be_identified.txt`;
  const subModulePath = `${id}/SubModule.xml`;

  const charactersXml = createCharactersXml(wanderersWithFixedIds);
  const wandererStringXml = createWandererStringsXml(wanderersWithFixedIds);
  const xmlAttrsToIdentifyTxt = createXmlAttrsToIdentifyText(id, charactersFilePath, stringsFilePath);
  const subModuleXml = createSubModuleXml(name, id, version, charactersFilePath);

  const zip = new JSZip();
  zip.file(wandererStringsDllPath, wandererStringsDll);
  zip.file(charactersFilePath, charactersXml);
  zip.file(stringsFilePath, wandererStringXml);
  zip.file(xmlAttrsToIdentifyPath, xmlAttrsToIdentifyTxt);
  zip.file(subModulePath, subModuleXml);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { id, name, version, zipBlob };
}

export default createMod;
