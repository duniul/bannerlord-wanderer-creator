import set from 'lodash.set';
import isEqual from 'lodash.isequal';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Form, Header, Modal, ModalProps, FormGroup, Confirm } from 'semantic-ui-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { cultures } from '../types/culture';
import { voices } from '../types/voices';
import { Wanderer } from '../types/wanderers';
import { bodyPropertiesJsToXml, bodyPropertiesXmlToJs } from '../utils/bodyProperties';
import CultureSelect from './form/CultureSelect';
import { BeardSelect, FaceTemplateSelect, HairSelect } from './form/faceSelects';
import FormGrid from './form/FormGrid';
import NameInput from './form/NameInput';
import SexRadioGroup from './form/SexRadioGroup';
import SkillInputs from './form/SkillInputs';
import TraitSelects from './form/TraitSelects';
import UnitGroupSelect from './form/UnitGroupSelect';
import VoiceRadioGroup from './form/VoiceRadioGroup';
import WandererDialogue from './WandererDialogue';
import { UnitGroup } from '../types/unitGroups';
import useBooleanSetters from '../hooks/useBooleanSetters';
import EquipmentSelects from './form/EquipmentSelects';

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

const CenteredConfirm = styled(Confirm)`
  top: 50%;
  transform: translateY(-50%);
`;

const FORM_ID = 'wanderer-form';
const REQUIRED_LABEL = 'Required';

interface FormValues extends Partial<Wanderer> {
  useCustomFace: boolean;
  bodyPropertiesString?: string;
}

function wandererToFormValues(wanderer?: Wanderer): FormValues {
  const defaultFormValues: FormValues = {
    name: '',
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
    formValues.bodyPropertiesString = bodyPropertiesJsToXml(wanderer.face.bodyProperties);
  }

  return formValues;
}

const WandererModal = ({ wanderer, onUpdate, onClose, ...modalProps }: WandererModalProps) => {
  const initialFormValuesRef = useRef(wandererToFormValues(wanderer));
  const [formValues, setFormValues] = useState<FormValues>(initialFormValuesRef.current);
  const [showCloseConfirm, setShowUnsavedModal] = useState<boolean>(false);
  const [openCloseConfirm, closeCloseConfirm] = useBooleanSetters(setShowUnsavedModal);
  const [errors, setErrors] = useState<FormErrors>({});
  const hasErrors = useMemo(() => Object.values(errors).some((e) => typeof e === 'string'), [errors]);
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  const handleClose = useCallback(() => {
    if (!isEqual(formValuesRef.current, initialFormValuesRef.current)) {
      openCloseConfirm();
    } else {
      onClose();
    }
  }, [openCloseConfirm, onClose]);

  const handleSubmit = useCallback(() => {
    const { useCustomFace, ...values } = formValuesRef.current;
    const newErrors = {} as FormErrors;

    if (!values.name) {
      set(newErrors, 'name', REQUIRED_LABEL);
    }

    if (values.age && (values.age < 18 || values.age > 100)) {
      set(newErrors, 'age', 'Age must be between 18 and 100.');
    }

    let bodyProperties;

    if (useCustomFace) {
      if (!values.bodyPropertiesString) {
        set(newErrors, 'bodyPropertiesString', REQUIRED_LABEL);
      } else {
        try {
          bodyProperties = bodyPropertiesXmlToJs(values.bodyPropertiesString);
        } catch (e) {
          set(
            newErrors,
            'bodyPropertiesString',
            'Invalid BodyProperies XML (must be a BodyProperties element with a version and key, e.g. <BodyProperties version="x" key="x" />)'
          );
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
              beard: values.isFemale ? undefined : values.face?.beard,
            },
      } as any);

      onClose();
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
    <Modal dimmer="inverted" onClose={handleClose} {...modalProps}>
      <Modal.Header>{wanderer ? 'Edit' : 'Create new'} wanderer</Modal.Header>
      <Modal.Content style={{ padding: 32 }}>
        <StyledForm id={FORM_ID} size="large">
          <Header dividing>Character info</Header>
          <FormGroup widths="equal">
            <NameInput value={formValues.name} error={errors?.name} onChange={handleValueChange} />
            <Form.Input
              value={formValues.age}
              error={errors?.age}
              onChange={handleValueChange}
              type="number"
              name="age"
              label="Age"
              min={18}
              max={100}
              fluid
            />
          </FormGroup>

          <CultureSelect value={formValues.culture} onChange={handleValueChange} />
          <UnitGroupSelect value={formValues.defaultGroup} onChange={handleValueChange} />
          <SexRadioGroup isFemale={formValues.isFemale!} onChange={handleValueChange} />
          <VoiceRadioGroup value={formValues.voice!} onChange={handleValueChange} />

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

              {!formValues.isFemale && <BeardSelect value={formValues.face?.beard} onChange={handleValueChange} />}
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

          <Header dividing>Battle equipment</Header>
          <EquipmentSelects name="battleEquipment" value={formValues.battleEquipment} onChange={handleValueChange} />

          <Header dividing>Civilian equipment</Header>
          <EquipmentSelects
            name="civilianEquipment"
            value={formValues.civilianEquipment}
            onChange={handleValueChange}
            civilian
          />

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
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} primary negative={hasErrors}>
          Save wanderer
        </Button>
      </Modal.Actions>

      {showCloseConfirm && (
        <CenteredConfirm
          open={showCloseConfirm}
          size="tiny"
          header="Unsaved changes"
          content="You have unsaved changes, are you sure you want to close?"
          closeOnDocumentClick={false}
          closeOnDimmerClick={false}
          onCancel={closeCloseConfirm}
          onConfirm={onClose}
        />
      )}
    </Modal>
  );
};

export default WandererModal;
