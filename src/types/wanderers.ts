import { Culture } from './culture';
import { CivilianEquipmentTemplate, BattleEquipmentTemplate } from './equipment';
import { Face } from './face';
import { Skills } from './skills';
import { Traits } from './traits';
import { Voice } from './voices';
import { UnitGroup } from './unitGroups';

export interface Dialogue {
  prebackstory?: string;
  backstory_a?: string;
  backstory_b?: string;
  backstory_c?: string;
  response_1?: string;
  response_2?: string;
  backstory_d?: string;
}

export interface WandererWithoutDialogue {
  id: string;
  name: string;
  age: number;
  voice: Voice;
  culture: Culture;
  isFemale: boolean;
  battleTemplate: BattleEquipmentTemplate;
  civilianTemplate: CivilianEquipmentTemplate;
  defaultGroup: UnitGroup;
  face: Face;
  skills: Skills;
  traits: Traits;
}

export interface Wanderer extends WandererWithoutDialogue {
  dialogue: Dialogue;
}


export interface WandererModule {
  name: string;
  version: string;
  wanderers: Wanderer[];
}
