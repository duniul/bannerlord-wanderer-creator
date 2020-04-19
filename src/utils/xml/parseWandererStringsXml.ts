import set from 'lodash.set';
import convert, { Element } from 'xml-js';
import { Dialogue } from '../../types/wanderers';

export interface DialoguesByCharacterId {
  [K: string]: Dialogue;
}

function parseStringId(stringId: string) {
  const firstDotIndex = stringId.indexOf('.');

  if (firstDotIndex === -1) {
    return null;
  }

  return {
    dialogueKey: stringId.slice(0, firstDotIndex),
    characterId: stringId.slice(firstDotIndex + 1),
  };
}

export function parseWandererStringsXml(xml: string): DialoguesByCharacterId {
  const jsonifiedXml = convert.xml2js(xml);
  const stringElements = jsonifiedXml?.elements?.[0]?.elements?.[0]?.elements || [];

  const dialoguesByCharacterId = stringElements.reduce((acc: { [K: string]: string }, el: Element) => {
    const { id, text } = el.attributes || {};
    const { dialogueKey, characterId } = parseStringId(String(id)) || {};

    if (dialogueKey && characterId) {
      set(acc, `${characterId}.${dialogueKey}`, text);
    }

    return acc;
  }, {});

  return dialoguesByCharacterId;
}
