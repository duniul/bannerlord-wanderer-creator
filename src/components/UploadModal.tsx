import React, { useCallback, useState } from 'react';
import { Button, Header, Message, Modal, ModalProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { useModOptions } from '../contexts/ModOptionsContext';
import { WandererModule } from '../types/wanderers';
import loadMod from '../utils/loadMod';
import FileInput from './form/FileInput';
import { captureException } from '@sentry/browser';

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
  const [uploadErrorId, setUploadErrorId] = useState<string>();
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
          setUploadErrorId(undefined);
          setParsedMod(parsed || {});
        })
        .catch((error) => {
          const eventId = captureException(error);
          console.error(error);
          setLoading(false);
          setUploadErrorId(eventId);
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
    <Modal dimmer="inverted" size="tiny" onClose={onClose} {...modalProps}>
      <Modal.Header>Load mod</Modal.Header>
      <Modal.Content>
        <FileInputWrapper>
          <FileInput fluid size="large" onChange={handleUploadFile} negative={!!uploadErrorId} accept=".zip">
            {uploadedFile?.name || 'Select file to load'}
          </FileInput>
        </FileInputWrapper>

        {uploadErrorId && (
          <Message negative>
            <Message.Header>Sorry, the mod could not be loaded.</Message.Header>
            <Message.Content>
              <br />
              Error ID: <b>{uploadErrorId}</b>
              <br />
              <br />
              You can check the error log for potential causes, or ask for help on Github or NexusMods. When asking for
              help, please include the error ID above.
            </Message.Content>
          </Message>
        )}

        {!uploadErrorId && parsedMod && (
          <>
            <Header as="h3" variant="medium">
              ZIP content
            </Header>
            <p>
              Mod name: {parsedMod?.name}
              <br />
              Mod version: {parsedMod?.version}
              <br />
              Number of wanderers: {parsedMod?.wanderers?.length || 0}
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
        <Button primary negative={!!uploadErrorId} onClick={handleLoadMod} loading={loading} disabled={!parsedMod}>
          Load wanderers
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadModal;
