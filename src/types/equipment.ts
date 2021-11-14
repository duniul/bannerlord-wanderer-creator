/**
 * The key names match the slot attribute on Bannerlord's equipment,
 * and the value is the item ID.
 */
export interface EquipmentRoster {
  Head?: string;
  Cape?: string;
  Body?: string;
  Gloves?: string;
  Leg?: string;
  Horse?: string;
  HorseHarness?: string;
  Item0?: string;
  Item1?: string;
  Item2?: string
  Item3?: string;
}

export type EquipmentSlot = keyof EquipmentRoster;
