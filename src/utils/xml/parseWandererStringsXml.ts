import set from 'lodash.set';
import { Dialogue } from '../../types/wanderers';
import { XmlWandererStringsFile } from '../../types/xml';
import { parseXmlToJs } from './xmlParser';

export interface WandererDialogues {
  [WandererID: string]: Dialogue;
}

function parseDialoguePath(stringId: string): string | null {
  const firstDotIndex = stringId.indexOf('.');

  if (firstDotIndex === -1) {
    return null;
  }

  const dialogueStep = stringId.slice(0, firstDotIndex);
  const wandererId = stringId.slice(firstDotIndex + 1);

  if (!dialogueStep || !wandererId) {
    return null;
  }

  return `${wandererId}.${dialogueStep}`;
}

export function parseWandererStringsXml(xml: string): WandererDialogues {
  const jsXml = parseXmlToJs<XmlWandererStringsFile>(xml);
  const jsXmlDialogueStrings = jsXml.base.strings.string;

  const wandererDialogues: WandererDialogues = {};

  for (const jsXmlStrings of jsXmlDialogueStrings) {
    const { id, text } = jsXmlStrings._attrs;
    const dialoguePath = parseDialoguePath(String(id));

    if (dialoguePath) {
      set(wandererDialogues, dialoguePath, text);
    }
  }

  return wandererDialogues;
}
