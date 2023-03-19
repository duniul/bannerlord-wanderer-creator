import { Wanderer } from '../../types/wanderers';
import { XmlWandererString, XmlWandererStringsFile } from '../../types/xml';
import { buildXml } from './xmlParser';

function wandererDialogueToStringsXml(wanderer: Wanderer): XmlWandererString[] {
  const { id, dialogue } = wanderer;

  return Object.entries(dialogue).map(([key, text]) => ({
    _attrs: { id: `${key}.${id}`, text: text || '...' },
  }));
}

export function createWandererStringsXml(wanderers: Wanderer[]): string {
  const jsXml: XmlWandererStringsFile = {
    strings: {
      string: wanderers.flatMap(wandererDialogueToStringsXml),
    },
  };

  return buildXml(jsXml, { declaration: true });
}
