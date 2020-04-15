import React from 'react';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { unitGroups } from '../../types/unitGroups';
import { splitOnUppercase } from '../../utils/stringUtils';

type UnitGroupProps = Omit<FormSelectProps, 'options'>;

const unitGroupOptions = unitGroups.map((unitGroup) => ({
  key: unitGroup,
  text: splitOnUppercase(unitGroup).join(' '),
  value: unitGroup,
}));

const UnitGroupSelect = React.memo((props: UnitGroupProps) => (
  <Form.Select
    id="defaultGroup"
    name="defaultGroup"
    options={unitGroupOptions}
    label="Default unit group"
    placeholder="Select unit group"
    selection
    fluid
    {...props}
  />
));

export default UnitGroupSelect;
