import JSZip from 'jszip';
import { Wanderer, WandererModule } from '../types/wanderers';
import { parseCharactersXml } from './xml/parseCharactersXml';
import { parseWandererStringsXml, WandererDialogues } from './xml/parseWandererStringsXml';
import { parseSubModuleXml } from './xml/subModuleXml';

const CHARACTERS_REGEX = /\/(spspecialcharacters.*\.xml)$/g;
const WANDERER_STRINGS_REGEX = /\/(wanderer_strings.*\.xml)$/g;

function isFile(jsZipObject: JSZip.JSZipObject) {
  return jsZipObject.dir === false;
}

async function unzipModXmls(zippedModFile: File) {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(zippedModFile);

  async function getTextContent(filePath: string): Promise<string> {
    return unzipped.file(filePath)?.async('text') || '';
  }

  let characterPaths: string[] = [];
  let wandererStringsPaths: string[] = [];
  let subModulePath: string = '';

  Object.values(unzipped.files)
    .filter(isFile)
    .forEach(({ name }) => {
      if (CHARACTERS_REGEX.test(name)) {
        characterPaths.push(name);
      } else if (WANDERER_STRINGS_REGEX.test(name)) {
        wandererStringsPaths.push(name);
      } else if (name.endsWith('SubModule.xml')) {
        subModulePath = name;
      }
    });

  return {
    characterXmls: await Promise.all(characterPaths.map(getTextContent)),
    wandererStringsXmls: await Promise.all(wandererStringsPaths.map(getTextContent)),
    subModuleXml: subModulePath && (await getTextContent(subModulePath)),
  };
}

async function loadMod(zippedModFile: File): Promise<WandererModule> {
  const { characterXmls, wandererStringsXmls, subModuleXml } = await unzipModXmls(zippedModFile);

  const dialogues: WandererDialogues = wandererStringsXmls.reduce((acc, stringsXml) => {
    const parsedStrings = parseWandererStringsXml(stringsXml);
    return { ...acc, ...parsedStrings };
  }, {});

  const wanderers: Wanderer[] = characterXmls.flatMap(parseCharactersXml).map((partialWanderer) => ({
    ...partialWanderer,
    dialogue: dialogues[partialWanderer.id] || {},
  }));

  const { name, version } = parseSubModuleXml(subModuleXml);
  return { name, version, wanderers };
}

export default loadMod;
