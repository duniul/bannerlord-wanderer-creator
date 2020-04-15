import React from 'react';
import { Form, FormSelectProps } from 'semantic-ui-react';
import { BeardLabels, HairLabels } from '../../strings';
import { Beard, HairFemale, HairMale } from '../../types/face';
import { FaceTemplate } from '../../types/faceTemplates';

type FaceTemplateSelectProps = Omit<FormSelectProps, 'options'>;
type BeardSelectProps = Omit<FormSelectProps, 'options'>;

interface HairSelectProps extends Omit<FormSelectProps, 'options'> {
  isFemale: boolean;
}

const faceTemplates = Object.entries(FaceTemplate).map(([key, template]) => ({
  key: template,
  text: key.split(/(?=[A-Z])/).join(' '),
  value: template,
}));

const maleHairOptions = Object.values(HairMale).map((hair) => ({
  key: hair,
  text: HairLabels[hair],
  value: hair,
}));

const femaleHairOptions = Object.values(HairFemale).map((hair) => ({
  key: hair,
  text: HairLabels[hair],
  value: hair,
}));

const beardOptions = Object.values(Beard).map((beard) => ({
  key: beard,
  text: BeardLabels[beard],
  value: beard,
}));

const defaultSelectProps = {
  fluid: true,
  selection: true,
  search: true,
};

function getError(error: any) {
  if (error) {
    return {
      content: error,
      pointing: 'above',
    };
  }
}

export const FaceTemplateSelect = (props: FaceTemplateSelectProps) => {
  return (
    <Form.Select
      {...defaultSelectProps}
      name="face.template"
      placeholder="Select template"
      label="Base template"
      options={faceTemplates}
      required
      {...props}
      error={getError(props.error)}
    />
  );
};

export const HairSelect = ({ isFemale, ...rest }: HairSelectProps) => {
  return (
    <Form.Select
      {...defaultSelectProps}
      name="face.hair"
      placeholder="Select hair"
      label="Hair"
      options={isFemale ? femaleHairOptions : maleHairOptions}
      {...rest}
      error={getError(rest.error)}
    />
  );
};

export const BeardSelect = (props: BeardSelectProps) => {
  return (
    <Form.Select
      {...defaultSelectProps}
      name="face.beard"
      placeholder="Select beard"
      label="Beard"
      options={beardOptions}
      {...props}
      error={getError(props.error)}
    />
  );
};
