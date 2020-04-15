import React from 'react';
import styled from 'styled-components';
import { TraitVariantLabels } from '../strings';
import { Trait } from '../types/traits';

interface TraitTagProps {
  trait: Trait;
  value?: string;
}

enum TagType {
  Positive = 'positive',
  Negative = 'negative',
}

const Tag = styled.div<{ type: TagType }>`
  display: inline-block;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 50px;
  padding: 2px 6px;
  line-height: 1.4em;
  background: ${(props) => (props.type === TagType.Positive ? '#3fbe3f' : '#ef4545')};

  &:not(:last-of-type) {
    margin-right: 4px;
  }
`;

const TraitTag = ({ trait, value }: TraitTagProps): JSX.Element | null => {
  const numberValue = Number(value);
  const label = value && (TraitVariantLabels as any)[trait]?.[value];

  if (!label || !value || numberValue === 0) {
    return null;
  }

  return <Tag type={numberValue < 0 ? TagType.Negative : TagType.Positive}>{label}</Tag>;
};

export default TraitTag;
