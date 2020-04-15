import { FaceTemplate } from './faceTemplates';

export enum HairMale {
  Short = 'Short',
  ShortAndThin = 'ShortAndThin',
  Tousled = 'Tousled',
  SlickedLong = 'SlickedLong',
  Bald = 'Bald',
  PageBoy = 'PageBoy',
  LongAndBushy = 'LongAndBushy',
  Bowl = 'Bowl',
}

export enum HairFemale {
  Bald = 'Bald',
  Bobbed = 'Bobbed',
  RestingOnShoulders = 'RestingOnShoulders',
  ShoulderLengthTied = 'ShoulderLengthTied',
  AboveShoudlerLength = 'AboveShoulderLength',
  TiedLongOverShoulder = 'TiedLongOverShoulder',
  LongOverShoulder = 'LongOvershoulder',
  BraidedAboveEars = 'BraidedAboveEars',
  TiedInBack = 'TiedInBack',
  Ukrainian = 'Ukrainian',
}

export type Hair = HairMale | HairFemale;

export enum Beard {
  LightShort = 'LightShortBeard',
  HeavyShort = 'HeavyShortBeard',
  CleanShaven = 'Cleanshaven',
  DroopyMustache = 'DroopyMustache',
  MediumMustache = 'MediumMustache',
  BeardWithShavedCheeks = 'BeardWithShavedCheeks',
  BushyGoatee = 'BushyGoatee',
  HeavyLongBeard = 'HeavyLongBeard',
  LongScragglyBeard = 'LongScragglyBeard',
}

export interface BodyProperties {
  key: string;
  version: number;
  age?: number;
  weight?: number;
  build?: number;
}

export interface BaseFace {
  bodyProperties?: BodyProperties;
}

export interface FemaleFace extends BaseFace {
  template?: FaceTemplate;
  hair?: HairFemale;
}

export interface MaleFace extends BaseFace {
  template?: FaceTemplate;
  hair?: HairMale;
  beard?: Beard;
}

export type Face = MaleFace | FemaleFace;
