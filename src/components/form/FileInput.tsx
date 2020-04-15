import React, { useRef } from 'react';
import { Button, ButtonProps, Icon } from 'semantic-ui-react';

interface FileInputProps extends ButtonProps {
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}

const FileInput = ({ children, onChange, accept, ...buttonProps }: FileInputProps) => {
  const inputRef = useRef<any>();

  return (
    <>
      <Button onClick={() => inputRef.current.click()} {...buttonProps} icon labelPosition="left" basic>
        <Icon name="upload" />
        {children || 'Select or drop file'}
      </Button>
      <input hidden ref={inputRef} type="file" onChange={onChange} accept={accept} />
    </>
  );
};

export default FileInput;
