import React, { useCallback, useState } from 'react';
import { Button, Header, Message, Modal, ModalProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { useModOptions } from '../contexts/ModOptionsContext';
import { WandererModule } from '../types/wanderers';
import loadMod from '../utils/loadMod';
import FileInput from './form/FileInput';
import TransitionableModal from './TransitionableModal';

interface UploadModalProps extends Pick<ModalProps, Exclude<keyof ModalProps, 'onClose'>> {
  onClose: any;
}

const FileInputWrapper = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;

const UploadModal = ({ onClose, ...modalProps }: UploadModalProps) => {
  const { setModName, setModVersion, setWanderers } = useModOptions();
  const [loading, setLoading] = useState<boolean>();
  const [uploadError, setUploadError] = useState<string>();
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [parsedMod, setParsedMod] = useState<WandererModule>();

  const handleUploadFile = useCallback((event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      setLoading(true);
      setUploadedFile(file);

      loadMod(file)
        .then((parsed) => {
          setLoading(false);

          if (parsed?.wanderers.length > 0) {
            setUploadError(undefined);
            setParsedMod(parsed);
          } else {
            setUploadError('The zip file does not contain any wanderers.');
          }
        })
        .catch(() => {
          setLoading(false);
          setUploadError('Sorry, the mod could not be loaded.');
        });
    }
  }, []);

  const handleLoadMod = useCallback(() => {
    if (parsedMod) {
      setModName(parsedMod.name);
      setModVersion(parsedMod.version);
      setWanderers(parsedMod.wanderers);
    }

    onClose();
  }, [onClose, parsedMod, setModName, setModVersion, setWanderers]);

  return (
    <TransitionableModal dimmer="inverted" size="tiny" onClose={onClose} {...modalProps}>
      <Modal.Header>Load mod</Modal.Header>
      <Modal.Content>
        <FileInputWrapper>
          <FileInput fluid size="large" onChange={handleUploadFile} negative={!!uploadError} accept=".zip">
            {uploadedFile?.name || 'Select file to load'}
          </FileInput>
        </FileInputWrapper>

        {uploadError && (
          <Message negative>
            <Message.Header>{uploadError}</Message.Header>
          </Message>
        )}

        {!uploadError && parsedMod && (
          <>
            <Header as="h3" variant="medium">
              ZIP content
            </Header>
            <p>
              Mod name: {parsedMod.name}
              <br />
              Mod version: {parsedMod.version}
              <br />
              Number of wanderers: {parsedMod.wanderers.length}
            </p>
          </>
        )}

        <Header as="h3" variant="medium">
          What is this?
        </Header>
        <p>
          You can upload a zip-file created through the Wanderer Creator to reload all the characters, allowing you to
          edit them again. This might work with other Wanderer Mods too, but is not guaranteed.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button primary negative={!!uploadError} onClick={handleLoadMod} loading={loading} disabled={!parsedMod}>
          Load wanderers
        </Button>
      </Modal.Actions>
    </TransitionableModal>
  );
};

export default UploadModal;
