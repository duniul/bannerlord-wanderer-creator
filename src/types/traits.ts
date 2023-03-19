export const TRAIT_LEVELS = [-2, -1, 1, 2] as const;

export type TraitLevel = typeof TRAIT_LEVELS[number];

export enum Trait {
  Calculating = 'Calculating',
  Generosity = 'Generosity',
  Honor = 'Honor',
  Mercy = 'Mercy',
  Valor = 'Valor',
}

export type Traits = {
  [K in Trait]?: TraitLevel;
};

export const TRAITS = Object.values(Trait);
