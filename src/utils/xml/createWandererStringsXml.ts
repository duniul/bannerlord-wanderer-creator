import convert from 'xml-js';
import { Wanderer } from '../../types/wanderers';

function mapWandererToWandererStringsXML(wanderer: Wanderer) {
  const { id, dialogue } = wanderer;
  return Object.entries(dialogue).map(([key, text]) => ({
    type: 'element',
    name: 'string',
    attributes: {
      id: `${key}.${id}`,
      text: text || '...',
    },
  }));
}

export function createWandererStringsXml(wanderers: Wanderer[]): string {
  const stringElements = wanderers.map(mapWandererToWandererStringsXML);

  const baseXmlJson = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'utf-8',
      },
    },
    elements: [
      {
        type: 'element',
        name: 'base',
        attributes: {
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
          type: 'string',
        },
        elements: [
          {
            type: 'element',
            name: 'strings',
            elements: stringElements.flatMap((e) => e),
          },
        ],
      },
    ],
  };

  const xmlString = convert.js2xml(baseXmlJson, { spaces: 2 });
  return xmlString;
}
