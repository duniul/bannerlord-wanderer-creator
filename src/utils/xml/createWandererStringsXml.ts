import { Wanderer } from '../../types/wanderers';
import { XmlWandererString, XmlWandererStringsFile } from '../../types/xml';
import { parseJsToXml } from './xmlParser';

function wandererDialogueToStringsXml(wanderer: Wanderer): XmlWandererString[] {
  const { id, dialogue } = wanderer;

  return Object.entries(dialogue).map(([key, text]) => ({
    _attrs: { id: `${key}.${id}`, text: text || '...' },
  }));
}

export function createWandererStringsXml(wanderers: Wanderer[]): string {
  const jsXml: XmlWandererStringsFile = {
    base: {
      _attrs: {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        type: 'string',
      },
      strings: {
        string: wanderers.flatMap(wandererDialogueToStringsXml),
      },
    },
  };

  return parseJsToXml(jsXml, { declaration: true });
}
