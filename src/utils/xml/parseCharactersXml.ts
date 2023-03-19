import { decodeXML } from 'entities';
import { Culture } from '../../types/culture';
import { EquipmentRoster } from '../../types/equipment';
import { Beard, Face, Hair } from '../../types/face';
import { FaceTemplate } from '../../types/faceTemplates';
import { UnitGroup } from '../../types/unitGroups';
import { Voice } from '../../types/voices';
import { WandererWithoutDialogue } from '../../types/wanderers';
import {
  isXmlFaceWithBodyProperties,
  XmlEquipmentRoster,
  XmlEquipments,
  XmlFace,
  XmlIdValueTag,
  XmlNpcCharacter,
  XmlNpcCharactersFile
} from '../../types/xml';
import { parseXml } from './xmlParser';

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

function asSingleTag<T>(tagOrTags: T | T[]): T {
  return Array.isArray(tagOrTags) ? tagOrTags[0] : tagOrTags;
}

function asTagArray<T>(tagOrTags: T | T[] | undefined): T[] {
  if (!tagOrTags) {
    return [];
  }

  return Array.isArray(tagOrTags) ? tagOrTags : [tagOrTags];
}

function parseXmlFace(xmlFace: XmlFace | undefined): Face {
  if (!xmlFace) {
    return {};
  }

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

  asTagArray(tags).forEach((tag) => {
    const { id, value } = tag._attrs;
    record[id] = Number(value);
  });

  return record;
}

function parseXmlEquipmentRoster(xmlEquipmentRoster: XmlEquipmentRoster | undefined): EquipmentRoster {
  const equipment: EquipmentRoster = {};

  asTagArray(xmlEquipmentRoster?.equipment).forEach((xmlItem) => {
    const { id, slot } = xmlItem._attrs;
    equipment[slot] = id;
  });

  return equipment;
}

function parseXmlEquipments(
  xmlEquipments: XmlEquipments | undefined
): { battleEquipment: EquipmentRoster; civilianEquipment: EquipmentRoster } {
  if (!xmlEquipments) {
    return { battleEquipment: {}, civilianEquipment: {} };
  }

  const rosters = asTagArray(xmlEquipments.EquipmentRoster);
  const battleRoster = rosters.find((roster) => !roster._attrs?.civilian);
  const civilianRoster = rosters.find((roster) => !!roster._attrs?.civilian);

  return {
    battleEquipment: parseXmlEquipmentRoster(battleRoster),
    civilianEquipment: parseXmlEquipmentRoster(civilianRoster),
  };
}

function parseXmlNpcCharacter(xmlNpcCharacter: XmlNpcCharacter): WandererWithoutDialogue {
  const { id, name, age, voice, culture, is_female: isFemale, default_group: defaultGroup } = xmlNpcCharacter._attrs;

  const { battleEquipment, civilianEquipment } = parseXmlEquipments(xmlNpcCharacter.Equipments);

  return {
    id,
    name: decodeXML(name),
    age,
    voice: voice as Voice,
    culture: stripXmlScope(culture) as Culture,
    isFemale: !!isFemale,
    defaultGroup: defaultGroup as UnitGroup,
    face: parseXmlFace(xmlNpcCharacter.face),
    skills: parseIdValueTags(xmlNpcCharacter.skills?.skill),
    traits: parseIdValueTags(xmlNpcCharacter.Traits?.Trait),
    battleEquipment,
    civilianEquipment,
  };
}

export function parseCharactersXml(xml: string): WandererWithoutDialogue[] {
  const jsXml = parseXml<XmlNpcCharactersFile>(xml);
  return asTagArray(jsXml.NPCCharacters.NPCCharacter).map(parseXmlNpcCharacter);
}
