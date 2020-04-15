import convert from 'xml-js';
import { WandererWithoutDialogue } from '../../types/wanderers';
import { Culture } from '../../types/culture';
import { CivilianEquipmentTemplate, EquipmentTemplate } from '../../types/equipment';
import { Beard, Face, Hair } from '../../types/face';
import { FaceTemplate } from '../../types/faceTemplates';
import { Skill, Skills } from '../../types/skills';
import { Trait, Traits, TraitVariant } from '../../types/traits';
import { UnitGroup } from '../../types/unitGroups';
import { Voice } from '../../types/voices';
import {
  BeardXML,
  BodyPropertiesXML,
  WandererXML,
  FaceTemplateXML,
  FaceXML,
  HairXML,
  SkillsXML,
  TraitsXML,
} from '../../types/xml';

function stripXmlScope(str: string | undefined) {
  if (!str) {
    return str;
  }

  const firstDot = str.indexOf('.');

  if (firstDot !== -1) {
    return str.slice(firstDot + 1);
  }

  return str;
}

function mapFaceXMLToJson(xmlFace: FaceXML): Face {
  const { elements } = xmlFace;
  const xmlBodyProperties = (elements as BodyPropertiesXML[]).find((el) => el.name === 'BodyProperties', undefined);

  if (xmlBodyProperties) {
    return { bodyProperties: xmlBodyProperties.attributes };
  }

  const xmlFaceTemplate = (elements as FaceTemplateXML[]).find((el: any) => el.name === 'face_key_template');
  const xmlHair = (elements as HairXML[]).find((el: any) => el.name === 'hair_tags');
  const xmlBeard = (elements as BeardXML[]).find((el: any) => el.name === 'beard_tags');

  return {
    template: stripXmlScope(xmlFaceTemplate?.attributes.value) as FaceTemplate,
    hair: xmlHair?.elements?.[0]?.attributes.name as Hair,
    beard: xmlBeard?.elements?.[0]?.attributes.name as Beard,
  };
}

function mapSkillsXMLToJson(xmlSkills: SkillsXML): Skills {
  const skills: Skills = {};

  xmlSkills?.elements?.forEach((xmlSkill) => {
    const { id, value } = xmlSkill.attributes;
    skills[id as Skill] = Number(value);
  });

  return skills;
}

function mapTraitsXMLToJson(xmlTraits: TraitsXML): Traits {
  const traits: Traits = {};

  xmlTraits?.elements?.forEach((xmlTrait) => {
    const { id, value } = xmlTrait.attributes;
    traits[id as Trait] = value as TraitVariant;
  });

  return traits;
}

function mapWandererXMLToJson(xmlWanderer: WandererXML): WandererWithoutDialogue {
  const { attributes, elements } = xmlWanderer;
  const {
    id,
    name,
    voice,
    culture,
    battleTemplate,
    civilianTemplate,
    is_female: isFemale,
    default_group: defaultGroup,
  } = attributes;

  const xmlFace = elements.find((el) => el.name === 'face');
  const xmlSkills = elements.find((el) => el.name === 'skills');
  const xmlTraits = elements.find((el) => el.name === 'Traits');

  return {
    id,
    name,
    voice: voice as Voice,
    culture: stripXmlScope(culture) as Culture,
    battleTemplate: stripXmlScope(battleTemplate) as EquipmentTemplate,
    civilianTemplate: stripXmlScope(civilianTemplate) as CivilianEquipmentTemplate,
    isFemale: isFemale === 'true',
    defaultGroup: defaultGroup as UnitGroup,
    face: xmlFace ? mapFaceXMLToJson(xmlFace as FaceXML) : {},
    skills: xmlSkills ? mapSkillsXMLToJson(xmlSkills as SkillsXML) : {},
    traits: xmlTraits ? mapTraitsXMLToJson(xmlTraits as TraitsXML) : {},
  };
}

export function parseCharactersXml(xml: string): WandererWithoutDialogue[] {
  const jsonResult = convert.xml2js(xml);
  const xmlWanderers = jsonResult.elements[0].elements;
  return xmlWanderers.map(mapWandererXMLToJson);
}
