import { encodeXML } from 'entities';
import { Face } from '../../types/face';
import { WandererWithoutDialogue } from '../../types/wanderers';
import { XmlFace, XmlIdValueTag, XmlNpcCharacter, XmlNpcCharactersFile } from '../../types/xml';
import { parseJsToXml } from './xmlParser';

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

function createJsXmlWanderer(wanderer: WandererWithoutDialogue): XmlNpcCharacter {
  const {
    id,
    name,
    age,
    voice,
    culture,
    battleTemplate,
    civilianTemplate,
    isFemale,
    defaultGroup,
    face,
    skills,
    traits,
  } = wanderer;

  return {
    _attrs: {
      id,
      name: encodeXML(name),
      age,
      voice,
      culture: 'Culture.' + culture,
      battleTemplate: 'NPCCharacter.' + battleTemplate,
      civilianTemplate: 'NPCCharacter.' + civilianTemplate,
      default_group: defaultGroup,
      is_female: isFemale || undefined,
      is_template: true,
      is_hero: false,
      occupation: 'Wanderer',
    },
    face: createJsXmlFace(face),
    skills: { skill: createIdValueTags(skills) },
    traits: { Trait: createIdValueTags(traits) },
  };
}

export function createCharactersXml(wanderers: WandererWithoutDialogue[]): string {
  const jsXml: XmlNpcCharactersFile = {
    NPCCharacters: {
      NPCCharacter: wanderers.map(createJsXmlWanderer),
    },
  };

  return parseJsToXml(jsXml, { declaration: true });
}
