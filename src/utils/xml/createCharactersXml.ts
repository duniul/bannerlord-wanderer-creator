import convert from 'xml-js';
import { WandererWithoutDialogue } from '../../types/wanderers';
import { Face, MaleFace } from '../../types/face';
import { Skills } from '../../types/skills';
import { Traits, TraitVariant } from '../../types/traits';
import { WandererXML, FaceXML, SkillsXML, TraitsXML } from '../../types/xml';

function mapTraitsJsonToXML(traits: Traits): TraitsXML {
  const elements: TraitsXML['elements'] = [];

  Object.entries(traits).forEach(([traitId, value]) => {
    if (value) {
      elements.push({
        type: 'element',
        name: 'Trait',
        attributes: {
          id: traitId,
          value: value as TraitVariant,
        },
      });
    }
  });

  return {
    type: 'element',
    name: 'Traits',
    elements,
  };
}

function mapSkillsJsonToXML(skills: Skills): SkillsXML {
  const elements: SkillsXML['elements'] = [];

  Object.entries(skills).forEach(([skillId, value]) => {
    if (value) {
      elements.push({
        type: 'element',
        name: 'skill',
        attributes: {
          id: skillId,
          value: String(value),
        },
      });
    }
  });

  return {
    type: 'element',
    name: 'skills',
    elements,
  };
}

function mapFaceJsonToXML(face: Face): FaceXML {
  const elements: FaceXML['elements'] = [];

  if (face.bodyProperties) {
    elements.push({
      type: 'element',
      name: 'BodyProperties',
      attributes: face.bodyProperties,
    });

    elements.push({
      type: 'element',
      name: 'BodyPropertiesMax',
      attributes: face.bodyProperties,
    });
  } else {
    elements.push({
      type: 'element',
      name: 'face_key_template',
      attributes: {
        value: 'NPCCharacter.' + face.template,
      },
    });

    if (face.hair) {
      elements.push({
        type: 'element',
        name: 'hair_tags',
        elements: [
          {
            type: 'element',
            name: 'hair_tag',
            attributes: { name: face.hair },
          },
        ],
      });
    }

    if ((face as MaleFace)?.beard) {
      elements.push({
        type: 'element',
        name: 'beard_tags',
        elements: [
          {
            type: 'element',
            name: 'beard_tag',
            attributes: { name: (face as MaleFace).beard! },
          },
        ],
      });
    }
  }

  return {
    type: 'element',
    name: 'face',
    elements,
  };
}

function mapWandererJsonToXML(wanderer: WandererWithoutDialogue): WandererXML {
  const {
    id,
    name,
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

  const faceElement = mapFaceJsonToXML(face);
  const skillsElement = mapSkillsJsonToXML(skills);
  const traitsElement = mapTraitsJsonToXML(traits);

  return {
    type: 'element',
    name: 'NPCCharacter',
    attributes: {
      id,
      name,
      voice,
      is_female: isFemale ? 'true' : undefined,
      culture: 'Culture.' + culture,
      battleTemplate: 'NPCCharacter.' + battleTemplate,
      civilianTemplate: 'NPCCharacter.' + civilianTemplate,
      default_group: defaultGroup,
      is_template: 'true',
      is_hero: 'false',
      occupation: 'Wanderer',
    },
    elements: [faceElement, skillsElement, traitsElement].filter(Boolean),
  };
}

export function createCharactersXml(wanderers: WandererWithoutDialogue[]): string {
  const npcCharacters = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'utf-8',
      },
    },
    elements: [
      {
        type: 'element',
        name: 'NPCCharacters',
        elements: wanderers.map(mapWandererJsonToXML),
      },
    ],
  };

  const xmlString = convert.js2xml(npcCharacters, { spaces: 2 });
  return xmlString;
}
