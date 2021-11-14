import React, { useCallback, useEffect } from 'react';
import { Form, Input, InputOnChangeData } from 'semantic-ui-react';
import styled from 'styled-components';

const Tip = styled.span`
  font-size: 12px;
`;

interface NameInputProps {
  value?: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
}

const NAME_ID = 'name';

const NameInput = ({ value, error, onChange }: NameInputProps) => {
  const handleChange = useCallback(
    (event, data) => {
      onChange(event, { ...data, value: data.value });
    },
    [onChange]
  );

  useEffect(() => {
    if (error) {
      (document.querySelector('#' + NAME_ID) as HTMLInputElement)?.focus();
    }
  }, [error]);

  return (
    <Form.Field
      required
      error={
        error && {
          content: error,
          pointing: 'above',
        }
      }
    >
      <label>Name</label>
      <Input
        style={{ marginBottom: 0 }}
        id={NAME_ID}
        name={NAME_ID}
        placeholder="Enter name"
        value={value}
        onChange={handleChange}
        required
      />
      <Tip>
        Multiple wanderers with the same name may show up after a while. To avoid this you can use the tag{' '}
        {'{HERO.FIRSTNAME}'} in the name to have it replaced by a random cultural name. Example: "{'{HERO.FIRSTNAME}'}{' '}
        the Strong" may show up as "John the Strong".
      </Tip>
    </Form.Field>
  );
};

export default NameInput;
