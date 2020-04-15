export enum Skill {
  OneHanded = 'OneHanded',
  TwoHanded = 'TwoHanded',
  Polearm = 'Polearm',
  Bow = 'Bow',
  Crossbow = 'Crossbow',
  Throwing = 'Throwing',
  Riding = 'Riding',
  Athletics = 'Athletics',
  Crafting = 'Crafting',
  Scouting = 'Scouting',
  Tactics = 'Tactics',
  Rougery = 'Roguery',
  Charm = 'Charm',
  Leadership = 'Leadership',
  Trade = 'Trade',
  Steward = 'Steward',
  Medicine = 'Medicine',
  Engineering = 'Engineering',
}

export type Skills = {
  [K in Skill]?: number;
};

export const skills = Object.values(Skill);
