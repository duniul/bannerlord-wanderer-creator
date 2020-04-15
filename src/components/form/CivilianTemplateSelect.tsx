import React from 'react';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { EquipmentLabels } from '../../strings';
import { CivilianEquipmentTemplate } from '../../types/equipment';

type CivilianTemplateSelectProps = Omit<FormSelectProps, 'options'>;

const civilianTemplateOptions = Object.values(CivilianEquipmentTemplate).map((template) => ({
  key: template,
  text: EquipmentLabels[template],
  value: template,
}));

const CivilianTemplateSelect = React.memo((props: CivilianTemplateSelectProps) => (
  <Form.Select
    id="civilianTemplate"
    name="civilianTemplate"
    placeholder="Select template"
    options={civilianTemplateOptions}
    label="Civilian outfit template"
    fluid
    selection
    search
    {...props}
  />
));

export default CivilianTemplateSelect;