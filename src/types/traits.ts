export enum Trait {
  Calculating = 'Calculating',
  Generosity = 'Generosity',
  Honor = 'Honor',
  Mercy = 'Mercy',
  Valor = 'Valor',
}

export enum TraitVariant {
  Minus2 = '-2',
  Minus1 = '-1',
  Zero = '0',
  Plus1 = '1',
  Plus2 = '2',
}

export type Traits = {
  [K in Trait]?: TraitVariant;
};

export const traits = Object.values(Trait);
export const traitVariants = Object.values(TraitVariant) as TraitVariant[];