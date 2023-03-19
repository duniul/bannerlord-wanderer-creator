import { encodeXML } from 'entities';
import { EquipmentRoster, EquipmentSlot } from '../../types/equipment';
import { Face } from '../../types/face';
import { WandererWithoutDialogue } from '../../types/wanderers';
import {
  XmlEquipmentItem,
  XmlEquipmentRoster,
  XmlFace,
  XmlIdValueTag,
  XmlNpcCharacter,
  XmlNpcCharactersFile,
} from '../../types/xml';
import { buildXml } from './xmlParser';

function createJsXmlFace(face: Face): XmlFace {
  if (face.bodyProperties) {
    return {
      BodyProperties: {
        _attrs: face.bodyProperties,
      },
      BodyPropertiesMax: {
        _attrs: face.bodyProperties,
      },
    };
  }

  const xmlFace: XmlFace = {
    face_key_template: {
      _attrs: { value: 'NPCCharacter.' + face.template },
    },
  };

  if (face.hair) {
    xmlFace.hair_tags = {
      hair_tag: {
        _attrs: { name: face.hair },
      },
    };
  }

  if (face.beard) {
    xmlFace.beard_tags = {
      beard_tag: {
        _attrs: { name: face.beard },
      },
    };
  }

  return xmlFace;
}

function createIdValueTags(keyNumberObj: Record<string, number>): XmlIdValueTag[] {
  return Object.entries(keyNumberObj)
    .filter(([, value]) => value != null)
    .map(([id, value]) => ({ _attrs: { id, value } }));
}

function createJsXmlEquipmentRoster(roster: EquipmentRoster, civilian: boolean): XmlEquipmentRoster | undefined {
  const equipment: XmlEquipmentItem[] = Object.entries(roster)
    .filter(([, id]) => !!id)
    .map(([slot, id]) => ({ _attrs: { id, slot: slot as EquipmentSlot } }));

  if (equipment.length === 0) {
    return undefined;
  }

  const xmlRoster: XmlEquipmentRoster = { _attrs: {}, equipment };

  if (civilian) {
    xmlRoster._attrs.civilian = true;
  }

  return xmlRoster;
}

function createJsXmlWanderer(wanderer: WandererWithoutDialogue): XmlNpcCharacter {
  const {
    id,
    name,
    age,
    voice,
    culture,
    isFemale,
    defaultGroup,
    face,
    skills,
    traits,
    battleEquipment,
    civilianEquipment,
  } = wanderer;

  const skillTags = createIdValueTags(skills);
  const traitTags = createIdValueTags(traits).filter((xmlTrait) => !!xmlTrait._attrs.value);
  const battleRoster = createJsXmlEquipmentRoster(battleEquipment, false);
  const civilianRoster = createJsXmlEquipmentRoster(civilianEquipment, true);

  const xmlNpcCharacter: XmlNpcCharacter = {
    _attrs: {
      id,
      name: encodeXML(name),
      age,
      voice,
      culture: 'Culture.' + culture,
      default_group: defaultGroup,
      is_female: isFemale,
      is_template: true,
      is_hero: false,
      occupation: 'Wanderer',
    },
    face: createJsXmlFace(face),
  };

  if (skillTags.length) {
    xmlNpcCharacter.skills = { skill: skillTags };
  }

  if (traitTags.length) {
    xmlNpcCharacter.Traits = { Trait: traitTags };
  }

  if (battleRoster || civilianRoster) {
    xmlNpcCharacter.Equipments = {
      EquipmentRoster: [battleRoster, civilianRoster].filter((roster): roster is XmlEquipmentRoster => !!roster),
    };
  }

  return xmlNpcCharacter;
}

export function createCharactersXml(wanderers: WandererWithoutDialogue[]): string {
  const jsXml: XmlNpcCharactersFile = {
    NPCCharacters: {
      NPCCharacter: wanderers.map(createJsXmlWanderer),
    },
  };

  return buildXml(jsXml, { declaration: true });
}
