import set from 'lodash.set';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Form, Header, Modal, ModalProps, FormGroup } from 'semantic-ui-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { cultures } from '../types/culture';
import { MaleFace } from '../types/face';
import { voices } from '../types/voices';
import { Wanderer } from '../types/wanderers';
import { mapBodyPropertiesJsonToXml, mapBodyPropertiesXmlToJson } from '../utils/bodyProperties';
import BattleTemplateSelect from './form/BattleTemplateSelect';
import CivilianTemplateSelect from './form/CivilianTemplateSelect';
import CultureSelect from './form/CultureSelect';
import { BeardSelect, FaceTemplateSelect, HairSelect } from './form/faceSelects';
import FormGrid from './form/FormGrid';
import NameInput from './form/NameInput';
import SexRadioGroup from './form/SexRadioGroup';
import SkillInputs from './form/SkillInputs';
import TraitSelects from './form/TraitSelects';
import UnitGroupSelect from './form/UnitGroupSelect';
import VoiceRadioGroup from './form/VoiceRadioGroup';
import TransitionableModal from './TransitionableModal';
import WandererDialogue from './WandererDialogue';
import { UnitGroup } from '../types/unitGroups';

interface WandererModalProps extends Pick<ModalProps, Exclude<keyof ModalProps, 'onClose'>> {
  wanderer?: Wanderer;
  onUpdate: (wanderer: Wanderer) => void;
  onClose: Function;
}

interface FormErrors {
  [key: string]: any;
}

const StyledForm = styled(Form)`
  & .header:not(:first-of-type) {
    margin-top: 40px;
  }
`;

const FORM_ID = 'wanderer-form';
const REQUIRED_LABEL = 'Required';

interface FormValues extends Partial<Wanderer> {
  useCustomFace: boolean;
  bodyPropertiesString?: string;
}

function wandererToFormValues(wanderer?: Wanderer): FormValues {
  const defaultFormValues: FormValues = {
    culture: cultures[0],
    defaultGroup: UnitGroup.Infantry,
    age: 20,
    isFemale: false,
    voice: voices[0],
    useCustomFace: false,
  };

  const formValues = {
    ...defaultFormValues,
    ...(wanderer || {}),
    face: { ...(wanderer?.face || {}) },
    traits: { ...(wanderer?.traits || {}) },
    skills: { ...(wanderer?.skills || {}) },
    dialogue: { ...(wanderer?.dialogue || {}) },
  };

  if (!!wanderer?.face.bodyProperties) {
    formValues.useCustomFace = true;
    formValues.bodyPropertiesString = mapBodyPropertiesJsonToXml(wanderer.face.bodyProperties);
  }

  return formValues;
}

const WandererModal = ({ wanderer, onUpdate, onClose, ...modalProps }: WandererModalProps) => {
  const [formValues, setFormValues] = useState<FormValues>(wandererToFormValues(wanderer));

  const [errors, setErrors] = useState<FormErrors>({});
  const hasErrors = useMemo(() => Object.values(errors).some((e) => typeof e === 'string'), [errors]);
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  const handleSubmit = useCallback(() => {
    const { useCustomFace, ...values } = formValuesRef.current;
    const newErrors = {} as FormErrors;

    if (!values.name) {
      set(newErrors, 'name', REQUIRED_LABEL);
    }

    if (values.age && (values.age < 18 || values.age > 100)) {
      set(newErrors, 'age', 'Age must be between 18 and 100.');
    }

    if (!values.battleTemplate) {
      set(newErrors, 'battleTemplate', REQUIRED_LABEL);
    }

    if (!values.civilianTemplate) {
      set(newErrors, 'civilianTemplate', REQUIRED_LABEL);
    }

    let bodyProperties;

    if (useCustomFace) {
      if (!values.bodyPropertiesString) {
        set(newErrors, 'bodyPropertiesString', REQUIRED_LABEL);
      } else {
        try {
          bodyProperties = mapBodyPropertiesXmlToJson(values.bodyPropertiesString);
        } catch (e) {
          set(newErrors, 'bodyPropertiesString', 'Invalid BodyProperies XML.');
        }
      }
    } else {
      if (!values.face?.template) {
        set(newErrors, 'face.template', REQUIRED_LABEL);
      }
    }

    if (Object.keys(newErrors).length === 0) {
      onUpdate({
        ...values,
        id: values.id || uuidv4(),
        name: values.name!,
        isFemale: !!values.isFemale,
        face: useCustomFace
          ? {
              bodyProperties,
            }
          : {
              template: values.face?.template,
              hair: values.face?.hair,
              beard: values.isFemale ? undefined : (values.face as MaleFace)?.beard,
            },
      } as any);

      if (onClose) {
        onClose();
      }
    } else {
      setErrors(newErrors);
    }
  }, [onUpdate, onClose]);

  const handleValueChange = useCallback((event, data) => {
    const { name, value } = data;
    setFormValues((prev) => set({ ...prev }, name, value));
    setErrors((prev) => set({ ...prev }, name, undefined));
  }, []);

  const handleCheckedChange = useCallback((event, data) => {
    const { name } = data;
    setFormValues((prev) => ({ ...prev, [name]: !prev[name as keyof FormValues] }));
  }, []);

  return (
    <TransitionableModal dimmer="inverted" onClose={onClose} {...modalProps}>
      <Modal.Header>{wanderer ? 'Edit' : 'Create new'} wanderer</Modal.Header>
      <Modal.Content style={{ padding: 32 }}>
        <StyledForm id={FORM_ID} size="large">
          <Header dividing>Character info</Header>
          <FormGroup widths="equal">
            <NameInput value={formValues.name} error={errors?.name} onChange={handleValueChange} />
            <Form.Input value={formValues.age} error={errors?.age} onChange={handleValueChange} type="number" name="age" label="Age" min={18} max={100} fluid />
          </FormGroup>

          <CultureSelect value={formValues.culture} onChange={handleValueChange} />
          <UnitGroupSelect value={formValues.defaultGroup} onChange={handleValueChange} />
          <SexRadioGroup isFemale={formValues.isFemale!} onChange={handleValueChange} />
          <VoiceRadioGroup value={formValues.voice!} onChange={handleValueChange} />

          <Header dividing>Equipment</Header>

          <Form.Group widths="equal">
            <BattleTemplateSelect
              value={formValues.battleTemplate}
              error={errors?.battleTemplate}
              onChange={handleValueChange}
            />
            <CivilianTemplateSelect
              value={formValues.civilianTemplate}
              error={errors?.civilianTemplate}
              onChange={handleValueChange}
            />
          </Form.Group>

          <Header dividing>Appearance</Header>

          <Form.Checkbox
            name="useCustomFace"
            label="Use custom face"
            checked={formValues.useCustomFace}
            onChange={handleCheckedChange}
            toggle
          />

          {!formValues.useCustomFace ? (
            <FormGrid columns={formValues.isFemale ? 2 : 3}>
              <FaceTemplateSelect
                value={formValues.face?.template}
                error={errors?.face?.template}
                onChange={handleValueChange}
              />
              <HairSelect isFemale={!!formValues.isFemale} onChange={handleValueChange} value={formValues.face?.hair} />

              {!formValues.isFemale && (
                <BeardSelect value={(formValues.face as MaleFace)?.beard} onChange={handleValueChange} />
              )}
            </FormGrid>
          ) : (
            <Form.Input
              name="bodyPropertiesString"
              placeholder="Paste BodyProperties (Ctrl+C in character generation)"
              fluid
              label="BodyProperties"
              value={formValues.bodyPropertiesString}
              onChange={handleValueChange}
              required
              error={
                errors?.bodyPropertiesString && {
                  content: errors?.bodyPropertiesString,
                  pointing: 'above',
                }
              }
            />
          )}

          <Header dividing>Traits</Header>

          <FormGrid columns={3}>
            <TraitSelects traits={formValues.traits} onChange={handleValueChange} />
          </FormGrid>

          <Header dividing>Skills</Header>

          <FormGrid columns={3}>
            <SkillInputs skills={formValues.skills} onChange={handleValueChange} />
          </FormGrid>

          <Header dividing>Introduction dialogue</Header>

          <WandererDialogue
            name={formValues.name}
            culture={formValues.culture!}
            isFemale={formValues.isFemale!}
            dialogue={formValues.dialogue!}
            onChange={handleValueChange}
          />
        </StyledForm>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose as any}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} primary negative={hasErrors}>
          Save wanderer
        </Button>
      </Modal.Actions>
    </TransitionableModal>
  );
};

export default WandererModal;
