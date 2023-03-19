import JSZip from 'jszip';
import { Wanderer } from '../types/wanderers';
import { createCharactersXml } from './xml/createCharactersXml';
import { createCulturesXlst } from './xml/createCulturesXslt';
import { createWandererStringsXml } from './xml/createWandererStringsXml';
import { createSubModuleXml } from './xml/subModuleXml';

function stripNonAlphanumeric(string: string): string {
  return string.replace(/[^a-zA-Z\d_]/g, '');
}

function updateWandererIds(modId: string, wanderers: Wanderer[]) {
  const ids = new Set();

  return wanderers.map((wanderer) => {
    const namePart = wanderer.name.toLowerCase().replace(' ', '_');
    const baseId = stripNonAlphanumeric(`${modId.toLowerCase()}_${namePart}`);
    let id = baseId;
    let duplicateIncrement = 0;

    while (ids.has(id)) {
      duplicateIncrement++;
      id = `${baseId}_${duplicateIncrement}`;
    }

    ids.add(id);
    return { ...wanderer, id };
  });
}

async function createMod(props: { name: string; version: string; wanderers: Wanderer[] }) {
  const { name, version, wanderers } = props;

  const modId = stripNonAlphanumeric(`zz${name}`);
  const lowerCaseModId = modId.toLowerCase();
  const wanderersWithFixedIds = updateWandererIds(modId, wanderers);
  const moduleDataPath = `${modId}/ModuleData`;

  const culturesFileName = `spcultures_${lowerCaseModId}.xslt`;
  const charactersFileName = `spspecialcharacters_${lowerCaseModId}.xml`;
  const stringsFileName = `wanderer_strings_${lowerCaseModId}.xml`;

  const culturesXslt = createCulturesXlst(wanderersWithFixedIds);
  const charactersXml = createCharactersXml(wanderersWithFixedIds);
  const wandererStringXml = createWandererStringsXml(wanderersWithFixedIds);

  const subModuleXml = createSubModuleXml({
    name,
    id: modId,
    version,
    modulePaths: {
      cultures: culturesFileName,
      characters: charactersFileName,
      strings: stringsFileName,
    },
  });

  const zip = new JSZip();
  zip.file(`${moduleDataPath}/${culturesFileName}`, culturesXslt);
  zip.file(`${moduleDataPath}/${charactersFileName}`, charactersXml);
  zip.file(`${moduleDataPath}/${stringsFileName}`, wandererStringXml);
  zip.file(`${modId}/SubModule.xml`, subModuleXml);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { id: modId, name, version, zipBlob };
}

export default createMod;
