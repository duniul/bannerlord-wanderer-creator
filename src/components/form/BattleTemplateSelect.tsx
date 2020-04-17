import React from 'react';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { EquipmentLabels } from '../../strings';
import { BattleEquipmentTemplate } from '../../types/equipment';

type BattleTemplateSelectProps = Omit<FormSelectProps, 'options'>;

const battleTemplateOptions = Object.values(BattleEquipmentTemplate).map((template) => ({
  key: template,
  text: EquipmentLabels[template],
  value: template,
}));

const BattleTemplateSelect = React.memo((props: BattleTemplateSelectProps) => (
  <Form.Select
    id="battleTemplate"
    name="battleTemplate"
    placeholder="Select template"
    options={battleTemplateOptions}
    label="Battle outfit template"
    fluid
    selection
    search
    {...props}
  />
));

export default BattleTemplateSelect;
