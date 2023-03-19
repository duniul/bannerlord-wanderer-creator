import React from 'react';
import { Form, RadioProps } from 'semantic-ui-react';
import { VoiceLabels } from '../../strings';
import { Voice, voices } from '../../types/voices';

interface VoiceRadioGroupProps {
  value: Voice;
  onChange: (event: React.FormEvent<HTMLInputElement>, data: RadioProps) => void;
}

const NAME = 'voice';

const VoiceRadioGroup = React.memo(({ value, onChange }: VoiceRadioGroupProps) => {
  const defaultProps = { name: NAME, onChange };

  return (
    <Form.Group inline>
      <label>Voice</label>
      {voices.map((voice) => (
        <Form.Radio
          {...defaultProps}
          key={voice}
          id={voice}
          value={voice}
          label={VoiceLabels[voice]}
          checked={value === voice}
        />
      ))}
    </Form.Group>
  );
});

export default VoiceRadioGroup;
