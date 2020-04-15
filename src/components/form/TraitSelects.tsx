import React, { useMemo } from 'react';
import { Form, StrictFormSelectProps } from 'semantic-ui-react';
import { TraitLabels, TraitVariantLabels } from '../../strings';
import { Trait, Traits, traits, TraitVariant, traitVariants } from '../../types/traits';

interface TraitSelectsProps {
  traits?: Traits;
  onChange: StrictFormSelectProps['onChange'];
}

interface TraitSelectProps {
  id: Trait;
  value?: TraitVariant;
  onChange: StrictFormSelectProps['onChange'];
}

interface TraitOptionProps {
  id: Trait;
  value?: TraitVariant;
}

const TraitOption = ({ id, value }: TraitOptionProps) => {
  const number = Number(value);
  const label = value && (TraitVariantLabels[id] as any)?.[value];
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
      traitVariants.map((value) => ({
        key: value,
        value,
        text: <TraitOption id={id} value={value} />,
      })),
    [id]
  );

  return (
    <Form.Select
      name={`traits[${id}]`}
      placeholder="Select value"
      label={TraitLabels[id]}
      options={traitOptions}
      value={value}
      onChange={onChange}
      selection
      fluid
    />
  );
});

const TraitSelects = ({ traits: traitValues, onChange }: TraitSelectsProps) => {
  return (
    <>
      {traits.map((id: Trait) => (
        <TraitSelect key={id} id={id} value={traitValues?.[id]} onChange={onChange} />
      ))}
    </>
  );
};

export default TraitSelects;
