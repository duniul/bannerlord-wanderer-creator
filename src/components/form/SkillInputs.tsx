import React, { useCallback } from 'react';
import { Form, Image, InputProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { SkillLabels } from '../../strings';
import { Skill, Skills, skills } from '../../types/skills';

interface SkillInputsProps {
  skills?: Skills;
  onChange: (event: React.FormEvent<HTMLInputElement>, data: InputProps) => void;
}

interface SkillInputProps {
  id: Skill;
  imageSrc: string;
  label: string;
  name: string;
  value: string | number | undefined;
  onChange: (event: React.FormEvent<HTMLInputElement>, data: InputProps) => void;
}

const MAX_VALUE = 300;
const MIN_VALUE = 0;

const SkillSlot = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > img {
    flex: 0 0 auto;
    max-width: 66px !important;
    max-height: 66px !important;
    margin-right: 8px;
  }

  & > * {
    flex: 1 0 auto;
  }
`;

const skillOptions = skills.map((id) => ({
  id: id,
  imageSrc: `images/skills/gui_skills_icon_${id.toLowerCase()}_small.png`,
  label: SkillLabels[id],
  name: `skills.${id}`,
}));

function formatValue(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const numberValue = Math.round(Number(value));
  const cappedValue = Math.max(Math.min(numberValue, MAX_VALUE), MIN_VALUE);
  return cappedValue;
}

const SkillInput = React.memo(({ imageSrc, label, name, value, onChange }: SkillInputProps) => (
  <SkillSlot>
    <Image size="tiny" src={imageSrc} bordered rounded />
    <Form.Input
      name={name}
      type="number"
      placeholder="0"
      label={label}
      value={value}
      onChange={onChange}
      min={0}
      max={300}
      fluid
    />
  </SkillSlot>
));

const SkillInputs = ({ skills, onChange }: SkillInputsProps) => {
  const handleSkillChange = useCallback(
    (event, data) => {
      onChange(event, { ...data, value: formatValue(data.value) });
    },
    [onChange]
  );

  return (
    <>
      {skillOptions.map((inputProps) => (
        <SkillInput {...inputProps} key={inputProps.id} value={skills?.[inputProps.id]} onChange={handleSkillChange} />
      ))}
    </>
  );
};

export default SkillInputs;
