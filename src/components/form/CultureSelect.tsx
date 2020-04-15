import React from 'react';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { CultureLabels } from '../../strings';
import { Culture } from '../../types/culture';

type CultureSelectProps = Omit<FormSelectProps, 'options'>;

const cultureOptions = Object.values(Culture).map((culture) => ({
  key: culture,
  text: CultureLabels[culture],
  value: culture,
  image: {
    avatar: true,
    src: `images/culture/${culture}.jpg`,
  },
}));

const CultureSelect = React.memo((props: CultureSelectProps) => (
  <Form.Select
    id="culture"
    name="culture"
    options={cultureOptions}
    label="Culture"
    placeholder="Select culture"
    selection
    fluid
    required
    {...props}
  />
));

export default CultureSelect;
