import { BodyProperties } from './face';

/*
 *  COMPANION
 */

export interface WandererXML {
  type: 'element';
  name: 'NPCCharacter';
  attributes: {
    id: string;
    name: string;
    voice: string;
    culture: string;
    battleTemplate: string;
    civilianTemplate: string;
    default_group: string;

    age?: string | undefined;
    is_female: 'true' | undefined;
    is_template: 'true';
    is_hero: 'false';
    occupation: 'Wanderer';
  };
  elements: Array<FaceXML | SkillsXML | TraitsXML>;
}

/*
 *  FACE
 */

export interface FaceXML {
  type: 'element';
  name: 'face';
  elements: Array<FaceTemplateXML | HairXML | BeardXML | BodyPropertiesXML>;
}

export interface FaceTemplateXML {
  type: 'element';
  name: 'face_key_template';
  attributes: {
    value: string;
  };
}

export interface HairXML {
  type: 'element';
  name: 'hair_tags';
  elements: [
    {
      type: 'element';
      name: 'hair_tag';
      attributes: {
        name: string;
      };
    }
  ];
}

export interface BeardXML {
  type: 'element';
  name: 'beard_tags';
  elements: [
    {
      type: 'element';
      name: 'beard_tag';
      attributes: {
        name: string;
      };
    }
  ];
}

export interface BodyPropertiesXML {
  type: 'element';
  name: 'BodyProperties' | 'BodyPropertiesMax';
  attributes: BodyProperties;
}

/*
 *  TRAITS
 */

export interface TraitXML {
  type: 'element';
  name: 'Trait';
  attributes: {
    id: string;
    value: string;
  };
}

export interface TraitsXML {
  type: 'element';
  name: 'Traits';
  elements: Array<TraitXML>;
}

/*
 *  SKILLS
 */

export interface SkillXML {
  type: 'element';
  name: 'skill';
  attributes: {
    id: string;
    value: string;
  };
}

export interface SkillsXML {
  type: 'element';
  name: 'skills';
  elements: Array<SkillXML>;
}
