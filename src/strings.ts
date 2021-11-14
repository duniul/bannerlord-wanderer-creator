import { Culture } from './types/culture';
import { FaceTemplate } from './types/faceTemplates';
import { Beard, HairMale, HairFemale } from './types/face';
import { Skill } from './types/skills';
import { Trait, TraitLevel } from './types/traits';
import { Voice } from './types/voices';

export const CultureLabels = {
  [Culture.Aserai]: 'Aserai',
  [Culture.Battania]: 'Battanian',
  [Culture.Empire]: 'Imperial',
  [Culture.Khuzait]: 'Khuzait',
  [Culture.Sturgia]: 'Sturgian',
  [Culture.Vlandia]: 'Vlandian',
};

export const VoiceLabels = {
  [Voice.Curt]: 'Curt',
  [Voice.Earnest]: 'Earnest',
  [Voice.Ironic]: 'Ironic',
  [Voice.SoftSpoken]: 'Soft-spoken',
};

export const SkillLabels = {
  [Skill.OneHanded]: 'One-Handed',
  [Skill.TwoHanded]: 'Two-Handed',
  [Skill.Polearm]: 'Polearm',
  [Skill.Bow]: 'Bow',
  [Skill.Crossbow]: 'Crossbow',
  [Skill.Throwing]: 'Throwing',
  [Skill.Riding]: 'Riding',
  [Skill.Athletics]: 'Athletics',
  [Skill.Crafting]: 'Smithing',
  [Skill.Scouting]: 'Scouting',
  [Skill.Tactics]: 'Tactics',
  [Skill.Rougery]: 'Roguery',
  [Skill.Charm]: 'Charm',
  [Skill.Leadership]: 'Leadership',
  [Skill.Trade]: 'Trade',
  [Skill.Steward]: 'Steward',
  [Skill.Medicine]: 'Medicine',
  [Skill.Engineering]: 'Engineering',
};

export const TraitLabels = {
  [Trait.Calculating]: 'Calculating',
  [Trait.Generosity]: 'Generosity',
  [Trait.Honor]: 'Honor',
  [Trait.Mercy]: 'Mercy',
  [Trait.Valor]: 'Valor',
};

type TraitLevelLabels = Record<TraitLevel, string>;

function createTraitLevelLabels(neg2: string, neg1: string, pos1: string, pos2: string): TraitLevelLabels {
  return { '-2': neg2, '-1': neg1, 1: pos1, 2: pos2 };
}

export const TRAIT_LEVEL_LABELS: Record<Trait, TraitLevelLabels> = {
  Calculating: createTraitLevelLabels('Hotheaded', 'Impulsive', 'Calculating', 'Cerebral'),
  Generosity: createTraitLevelLabels('Sadistic', 'Cruel', 'Merciful', 'Compassionate'),
  Mercy: createTraitLevelLabels('Tightfisted', 'Closefisted', 'Generous', 'Compassionate'),
  Valor: createTraitLevelLabels('Very cautious', 'Cautious', 'Daring', 'Munificent'),
  Honor: createTraitLevelLabels('Deceitful', 'Devious', 'Honest', 'Honorable'),
};

export const HairLabels = {
  [HairMale.Bald]: 'Bald',
  [HairMale.Short]: 'Short',
  [HairMale.ShortAndThin]: 'Short and thin',
  [HairMale.Tousled]: 'Tousled',
  [HairMale.SlickedLong]: 'Slicked, long',
  [HairMale.PageBoy]: 'Page boy',
  [HairMale.LongAndBushy]: 'Long and bushy',
  [HairMale.Bowl]: 'Bowl',
  [HairFemale.Bobbed]: 'Bobbed',
  [HairFemale.RestingOnShoulders]: 'Resting on shoulders',
  [HairFemale.ShoulderLengthTied]: 'Shoulder length, tied',
  [HairFemale.AboveShoudlerLength]: 'Above shoulder lengh',
  [HairFemale.TiedLongOverShoulder]: 'Tied over shoulder, long',
  [HairFemale.LongOverShoulder]: 'Over shoulder, long',
  [HairFemale.BraidedAboveEars]: 'Braided above ears',
  [HairFemale.TiedInBack]: 'Tied in back',
  [HairFemale.Ukrainian]: 'Ukrainian',
};

export const BeardLabels = {
  [Beard.LightShort]: 'Short beard, light',
  [Beard.HeavyShort]: 'Short beard, heavy',
  [Beard.CleanShaven]: 'Clean-shaven',
  [Beard.DroopyMustache]: 'Droopy mustache',
  [Beard.MediumMustache]: 'Medium mustache',
  [Beard.BeardWithShavedCheeks]: 'Beard with shaved cheeks',
  [Beard.BushyGoatee]: 'Bushy goatee',
  [Beard.HeavyLongBeard]: 'Long beard, heavy',
  [Beard.LongScragglyBeard]: 'Long beard, scraggly',
};

export const FaceTemplateLabels = {
  [FaceTemplate.VillagerAserai]: 'Aserai Villager',
  [FaceTemplate.VillagerBattania]: 'Battanian Villager',
  [FaceTemplate.VillagerEmpire]: 'Imperial Villager',
  [FaceTemplate.VillagerKhuzait]: 'Khuzait Villager',
  [FaceTemplate.VillagerVlandia]: 'Vlandian Villager',

  [FaceTemplate.TownsmanAserai]: 'Aserai Townsman',
  [FaceTemplate.TownsmanBattania]: 'Battanian Townsman',
  [FaceTemplate.TownsmanEmpire]: 'Imperial Townsman',
  [FaceTemplate.TownsmanKhuzait]: 'Khuzait Townsman',
  [FaceTemplate.TownsmanVlandia]: 'Vlandian Townsman',

  [FaceTemplate.VillageWomanAserai]: 'Aserai Villager',
  [FaceTemplate.VillageWomanBattania]: 'Battanian Villager',
  [FaceTemplate.VillageWomanEmpire]: 'Imperial Villager',
  [FaceTemplate.VillageWomanKhuzait]: 'Khuzait Villager',
  [FaceTemplate.VillageWomanVlandia]: 'Vlandian Villager',

  [FaceTemplate.BeggarAserai]: 'Aserai Beggar',
  [FaceTemplate.BeggarBattania]: 'Battanian Beggar',
  [FaceTemplate.BeggarEmpire]: 'Imperial Beggar',
  [FaceTemplate.BeggarKhuzait]: 'Khuzait Beggar',
  [FaceTemplate.BeggarSturgia]: 'Sturgian Beggar',
  [FaceTemplate.BeggarVlandia]: 'Vlandian Beggar',

  [FaceTemplate.TownswomanAserai]: 'Aserai Townswoman',
  [FaceTemplate.TownswomanBattania]: 'Battanian Townswoman',
  [FaceTemplate.TownswomanEmpire]: 'Imperial Townswoman',
  [FaceTemplate.TownswomanKhuzait]: 'Khuzait Townswoman',
  [FaceTemplate.TownswomanVlandia]: 'Vlandian Townswoman',

  [FaceTemplate.BanditDesert]: 'Desert Bandit',
  [FaceTemplate.BanditForest]: 'Forest Bandit',
  [FaceTemplate.BanditMountain]: 'Mountain Bandit',
  [FaceTemplate.BanditSteppe]: 'Steppe Bandit',
  [FaceTemplate.BanditSeaRaider]: 'Sea Raider',
};
