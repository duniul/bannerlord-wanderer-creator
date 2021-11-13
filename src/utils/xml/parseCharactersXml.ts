import { Culture } from '../../types/culture';
import { BattleEquipmentTemplate, CivilianEquipmentTemplate } from '../../types/equipment';
import { Beard, Face, Hair } from '../../types/face';
import { FaceTemplate } from '../../types/faceTemplates';
import { UnitGroup } from '../../types/unitGroups';
import { Voice } from '../../types/voices';
import { WandererWithoutDialogue } from '../../types/wanderers';
import {
  isXmlFaceWithBodyProperties,
  XmlFace,
  XmlIdValueTag,
  XmlNpcCharacter,
  XmlNpcCharactersFile,
} from '../../types/xml';
import { parseXmlToJs } from './xmlParser';

function stripXmlScope(str: string | undefined): string | undefined {
  if (!str) {
    return str;
  }

  const firstDot = str.indexOf('.');

  if (firstDot !== -1) {
    return str.slice(firstDot + 1);
  }

  return str;
}

function asSingleTag<T = unknown>(tagOrTags: T): T extends any[] ? never : T {
  return Array.isArray(tagOrTags) ? tagOrTags[0] : tagOrTags;
}

function asTagArray<T = unknown>(tagOrTags: T): T extends any[] ? T : never {
  if (!tagOrTags) {
    return [] as any;
  }

  return Array.isArray(tagOrTags) ? (tagOrTags as any) : [tagOrTags];
}

function parseXmlFace(xmlFace: XmlFace): Face {
  if (isXmlFaceWithBodyProperties(xmlFace)) {
    return { bodyProperties: xmlFace.BodyProperties._attrs };
  }

  return {
    template: xmlFace.face_key_template._attrs.value as FaceTemplate,
    hair: asSingleTag(xmlFace.hair_tags?.hair_tag)?._attrs.name as Hair,
    beard: asSingleTag(xmlFace.beard_tags?.beard_tag)?._attrs.name as Beard,
  };
}

function parseIdValueTags(tags: XmlIdValueTag | XmlIdValueTag[] | undefined): Record<string, number> {
  const record: Record<string, number> = {};

  asTagArray(tags)?.forEach((tag) => {
    const { id, value } = tag._attrs;
    record[id] = Number(value);
  });

  return record;
}

function parseXmlNpcCharacter(xmlNpcCharacter: XmlNpcCharacter): WandererWithoutDialogue {
  const {
    id,
    name,
    age,
    voice,
    culture,
    battleTemplate,
    civilianTemplate,
    is_female: isFemale,
    default_group: defaultGroup,
  } = xmlNpcCharacter._attrs;

  return {
    id,
    name: name.replace('&quot;', '"'),
    age,
    voice: voice as Voice,
    culture: stripXmlScope(culture) as Culture,
    battleTemplate: stripXmlScope(battleTemplate) as BattleEquipmentTemplate,
    civilianTemplate: stripXmlScope(civilianTemplate) as CivilianEquipmentTemplate,
    isFemale: !!isFemale,
    defaultGroup: defaultGroup as UnitGroup,
    face: parseXmlFace(xmlNpcCharacter.face),
    skills: parseIdValueTags(xmlNpcCharacter.skills?.skill),
    traits: parseIdValueTags(xmlNpcCharacter.traits?.Trait),
  };
}

export function parseCharactersXml(xml: string): WandererWithoutDialogue[] {
  const jsXml = parseXmlToJs<XmlNpcCharactersFile>(xml);
  return asTagArray(jsXml.NPCCharacters.NPCCharacter).map(parseXmlNpcCharacter);
}
