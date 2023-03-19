import React, { SyntheticEvent } from 'react';
import { DropdownItemProps, FormGroup, FormSelect, FormSelectProps } from 'semantic-ui-react';
import {
  BODY_ARMORS,
  CAPES,
  HAND_ARMORS,
  HEAD_ARMORS,
  Item,
  LEG_ARMORS,
  MOUNTS,
  MOUNT_HARNESSES,
  WEAPONS
} from '../../constants/items';
import { EquipmentRoster, EquipmentSlot } from '../../types/equipment';

function itemsToOptions(itemsObject: Record<string, Item>): DropdownItemProps[] {
  return Object.values(itemsObject).map((item) => ({ key: item.id, text: item.name, value: item.id }));
}

function filterCivilian(dropdownItemList: DropdownItemProps[], itemsObject: Record<string, Item>): DropdownItemProps[] {
  return dropdownItemList.filter((item) => !!itemsObject[item.value as string]?.civilian);
}

const weaponOptions = itemsToOptions(WEAPONS);

const options: Record<EquipmentSlot, DropdownItemProps[]> = {
  Head: itemsToOptions(HEAD_ARMORS),
  Cape: itemsToOptions(CAPES),
  Body: itemsToOptions(BODY_ARMORS),
  Gloves: itemsToOptions(HAND_ARMORS),
  Leg: itemsToOptions(LEG_ARMORS),
  Horse: itemsToOptions(MOUNTS),
  HorseHarness: itemsToOptions(MOUNT_HARNESSES),
  Item0: weaponOptions,
  Item1: weaponOptions,
  Item2: weaponOptions,
  Item3: weaponOptions,
};

const civilianOptions: Record<EquipmentSlot, DropdownItemProps[]> = {
  ...options,
  Head: filterCivilian(options.Head, HEAD_ARMORS),
  Cape: filterCivilian(options.Cape, CAPES),
  Body: filterCivilian(options.Body, BODY_ARMORS),
  Gloves: filterCivilian(options.Gloves, HAND_ARMORS),
  Leg: filterCivilian(options.Leg, LEG_ARMORS),
};

export interface EquipmentSelectsProps {
  name: string;
  value: EquipmentRoster | undefined;
  onChange: (
    event: SyntheticEvent<HTMLElement, Event>,
    data: { name: string; value: EquipmentRoster | undefined }
  ) => void;
  civilian?: boolean;
}

const EquipmentSelects = React.memo(({ name, value, onChange, civilian }: EquipmentSelectsProps) => {
  const getSlotProps = (slot: EquipmentSlot): FormSelectProps => {
    return {
      id: slot,
      name: slot,
      options: civilian ? civilianOptions[slot] : options[slot],
      value: value?.[slot],
      onChange: (event, data) => {
        onChange(event, { name, value: { ...value, [slot]: data.value } });
      },
      selection: true,
      search: true,
      fluid: true,
      clearable: true,
      placeholder: 'None',
    };
  };

  return (
    <>
      <FormGroup widths="equal">
        <FormSelect {...getSlotProps('Head')} label="Head armor" />
        <FormSelect {...getSlotProps('Cape')} label="Cape" />
      </FormGroup>
      <FormGroup widths="equal">
        <FormSelect {...getSlotProps('Body')} label="Body armor" />
        <FormSelect {...getSlotProps('Gloves')} label="Hand armor" />
        <FormSelect {...getSlotProps('Leg')} label="Leg armor" />
      </FormGroup>
      <FormGroup widths="equal">
        <FormSelect {...getSlotProps('Horse')} label="Mount" />
        <FormSelect {...getSlotProps('HorseHarness')} value={value?.HorseHarness} label="Mount harness" />
      </FormGroup>
      {!civilian && (
        <FormGroup widths="equal">
          <FormSelect {...getSlotProps('Item0')} label="Weapon 1" />
          <FormSelect {...getSlotProps('Item1')} label="Weapon 2" />
          <FormSelect {...getSlotProps('Item2')} label="Weapon 3" />
          <FormSelect {...getSlotProps('Item3')} label="Weapon 4" />
        </FormGroup>
      )}
    </>
  );
});

export default EquipmentSelects;
