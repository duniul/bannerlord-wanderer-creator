import React, { useCallback, useEffect } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';

interface NameInputProps {
  value?: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void;
}

const NAME_ID = 'name';
const NAME_PATTERN = /[^a-zA-ZÀ-ÿ\d'\-'" ]/g;

const NameInput = ({ value, error, onChange }: NameInputProps) => {
  const handleChange = useCallback(
    (event, data) => {
      onChange(event, { ...data, value: data.value.replace(NAME_PATTERN, '') });
    },
    [onChange]
  );

  useEffect(() => {
    if (error) {
      (document.querySelector('#' + NAME_ID) as HTMLInputElement)?.focus();
    }
  }, [error]);

  return (
    <Form.Input
      id={NAME_ID}
      name={NAME_ID}
      label="Surname or title"
      placeholder="Oakenshield, dey Oks, the Strong"
      value={value}
      onChange={handleChange}
      required
      error={
        error && {
          content: error,
          pointing: 'above',
        }
      }
    />
  );
};

export default NameInput;
