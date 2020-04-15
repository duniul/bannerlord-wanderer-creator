import React, { useCallback } from 'react';
import { Form, RadioProps } from 'semantic-ui-react';

interface SexRadioGroupProps {
  isFemale: boolean;
  onChange: (event: React.FormEvent<HTMLInputElement>, data: RadioProps) => void;
}

const NAME = 'isFemale';

const SexRadioGroup = React.memo(({ isFemale, onChange }: SexRadioGroupProps) => {
  const handleSexChange = useCallback(
    (event, data) => {
      onChange(event, { ...data, value: data.value === 'female' });
    },
    [onChange]
  );

  const defaultProps = { name: NAME, onChange: handleSexChange };

  return (
    <Form.Group inline>
      <label>Sex</label>
      <Form.Radio {...defaultProps} id="male" value="male" label="Male" checked={!isFemale} />
      <Form.Radio {...defaultProps} id="female" value="female" label="Female" checked={isFemale} />
    </Form.Group>
  );
});

export default SexRadioGroup;
