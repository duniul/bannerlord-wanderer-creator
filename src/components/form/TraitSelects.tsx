import React, { useMemo } from 'react';
import { Form, StrictFormSelectProps } from 'semantic-ui-react';
import { TraitLabels, TRAIT_LEVEL_LABELS } from '../../strings';
import { Trait, TraitLevel, Traits, TRAITS, TRAIT_LEVELS } from '../../types/traits';

interface TraitSelectsProps {
  traits?: Traits;
  onChange: StrictFormSelectProps['onChange'];
}

interface TraitSelectProps {
  id: Trait;
  value?: TraitLevel;
  onChange: StrictFormSelectProps['onChange'];
}

interface TraitOptionProps {
  id: Trait;
  value?: TraitLevel;
}

const TraitOption = ({ id, value }: TraitOptionProps) => {
  const number = Number(value);
  const label = value && TRAIT_LEVEL_LABELS[id]?.[value];
  let color = undefined;

  if (number > 0) {
    color = 'green';
  }

  if (number < 0) {
    color = 'red';
  }

  return (
    <span>
      {label || 'Default'} (<span style={{ color }}>{value}</span>)
    </span>
  );
};

const TraitSelect = React.memo(({ id, value, onChange }: TraitSelectProps) => {
  const traitOptions = useMemo(
    () =>
      TRAIT_LEVELS.map((value) => ({
        key: value,
        value,
        text: <TraitOption id={id} value={value} />,
      })),
    [id]
  );

  return (
    <Form.Select
      name={`traits[${id}]`}
      placeholder="Default"
      label={TraitLabels[id]}
      options={traitOptions}
      value={value}
      onChange={onChange}
      clearable
      selection
      fluid
    />
  );
});

const TraitSelects = ({ traits: traitValues, onChange }: TraitSelectsProps) => {
  return (
    <>
      {TRAITS.map((id: Trait) => (
        <TraitSelect key={id} id={id} value={traitValues?.[id]} onChange={onChange} />
      ))}
    </>
  );
};

export default TraitSelects;
