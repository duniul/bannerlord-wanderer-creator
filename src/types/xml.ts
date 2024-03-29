import { EquipmentSlot } from './equipment';
import { BodyProperties } from './face';

// These types represent objects equivalent to Bannerlord's XML tags.
// The tag and attribute names should not be changed.

//
// CHARACTERS
//

export interface XmlNpcCharactersFile {
  NPCCharacters: {
    NPCCharacter: XmlNpcCharacter | XmlNpcCharacter[];
  };
}

export interface XmlNpcCharacter {
  _attrs: {
    id: string;
    name: string;
    voice: string;
    culture: string;
    default_group: string;
    age: number;
    is_female: boolean;
    is_template: true;
    is_hero: false;
    occupation: 'Wanderer';
  };
  face: XmlFace;
  skills?: XmlSkills;
  Traits?: XmlTraits;
  Equipments?: XmlEquipments;
}

//
// FACE
//

export type XmlFace = XmlFaceWithTemplate | XmlFaceWithBodyProperties;

export interface XmlFaceWithTemplate {
  face_key_template: XmlFaceKeyTemplate;
  hair_tags?: XmlHairTags;
  beard_tags?: XmlBeardTags;
}

export interface XmlFaceWithBodyProperties {
  BodyProperties: XmlBodyProperties;
  BodyPropertiesMax?: XmlBodyProperties;
}

export function isXmlFaceWithBodyProperties(xmlFace: XmlFace): xmlFace is XmlFaceWithBodyProperties {
  return !!(xmlFace as any).BodyProperties;
}

export interface XmlFaceKeyTemplate {
  _attrs: {
    value: string;
  };
}

export interface XmlHairTags {
  hair_tag: XmlHairTag | XmlHairTag[];
}

export interface XmlHairTag {
  _attrs: {
    name: string;
  };
}

export interface XmlBeardTags {
  beard_tag: XmlBeardTag | XmlBeardTag[];
}

export interface XmlBeardTag {
  _attrs: {
    name: string;
  };
}

export interface XmlBodyProperties {
  _attrs: BodyProperties;
}

//
// SKILLS & TRAITS
//

export interface XmlSkills {
  skill: XmlSkill | XmlSkill[];
}

export type XmlSkill = XmlIdValueTag;

export interface XmlTraits {
  Trait: XmlTrait | XmlTrait[];
}

export type XmlTrait = XmlIdValueTag;

export interface XmlIdValueTag {
  _attrs: {
    id: string;
    value: number;
  };
}

//
// EQUIPMENT
//

export interface XmlEquipments {
  EquipmentRoster: XmlEquipmentRoster | XmlEquipmentRoster[];
}

export interface XmlEquipmentRoster {
  _attrs: {
    civilian?: true;
  };
  equipment: XmlEquipmentItem | XmlEquipmentItem[];
}

export interface XmlEquipmentItem {
  _attrs: {
    id: string;
    slot: EquipmentSlot;
  };
}

//
// DIALOGUE
//

export interface XmlWandererStringsFile {
  strings: {
    string: XmlWandererString[];
  };
}

export interface XmlWandererString {
  _attrs: {
    id: string;
    text: string;
  };
}
