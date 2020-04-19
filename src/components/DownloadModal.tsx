import { saveAs } from 'file-saver';
import set from 'lodash.set';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Message, Modal, ModalProps } from 'semantic-ui-react';
import { useModOptions } from '../contexts/ModOptionsContext';
import { Wanderer } from '../types/wanderers';
import createMod from '../utils/createMod';
import { captureException } from '@sentry/browser';

interface DownloadModalProps extends Pick<ModalProps, Exclude<keyof ModalProps, 'onClose'>> {
  onClose: any;
}

interface FormErrors {
  [key: string]: any;
}

function formatModName(modName: string) {
  return modName.replace(/[^a-zA-Z\d ]/g, '');
}

function formatModVersion(modVersion: string) {
  return modVersion.replace(/[^\d.]/g, '');
}

async function createAndDownloadMod(name: string, version: string, wanderers: Wanderer[]) {
  const wandererStringsLoaderDll = await fetch('/bin/WandererStringsLoader.dll').then((response) => response.blob());

  return createMod(name, version, wanderers, wandererStringsLoaderDll).then((result) => {
    const { id, zipBlob } = result;
    saveAs(zipBlob, `${id}_${version.replace('.', '_')}.zip`);

    return result;
  });
}

const DownloadModal = ({ onChangeModName, onChangeModVersion, onClose, ...modalProps }: DownloadModalProps) => {
  const { wanderers, modName, modVersion, setModName, setModVersion } = useModOptions();
  const [loading, setLoading] = useState<boolean>();
  const [modErrorId, setModErrorId] = useState<string>();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const hasErrors = useMemo(() => !!modErrorId || Object.values(formErrors).some((e) => !!e), [modErrorId, formErrors]);

  const handleModNameChange = useCallback(
    (event, data) => {
      const { value } = data;
      setModName(formatModName(value));
      setFormErrors((prev) => set({ ...prev }, 'modName', undefined));
    },
    [setModName]
  );

  const handleModVersionChange = useCallback(
    (event, data) => {
      const { value } = data;
      setModVersion(formatModVersion(value));
      setFormErrors((prev) => set({ ...prev }, 'modVersion', undefined));
    },
    [setModVersion]
  );

  const handleDownload = useCallback(() => {
    const newErrors = {} as FormErrors;

    if (!modName) {
      newErrors.modName = 'Required';
    }

    if (!modVersion) {
      newErrors.modVersion = 'Required';
    }

    if (!/\d+\.\d+\.\d+/.test(modVersion)) {
      newErrors.modVersion = 'Invalid format, needs to follow the pattern: #.#.#';
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      createAndDownloadMod(modName, modVersion, wanderers)
        .then(() => {
          setLoading(false);
          setModErrorId(undefined);
          onClose();
        })
        .catch((error) => {
          const eventId = captureException(error);
          setLoading(false);
          setModErrorId(eventId);
        });
    } else {
      setFormErrors(newErrors);
    }
  }, [modName, modVersion, onClose, wanderers]);

  return (
    <Modal dimmer="inverted" onClose={onClose} size="tiny" {...modalProps}>
      <Modal.Header>Download module</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            label="Mod name"
            placeholder="My Custom Wanderers"
            value={modName}
            onChange={handleModNameChange}
            required
            error={formErrors.modName && { content: formErrors.modName, pointing: 'above' }}
          />

          <Form.Input
            fluid
            label="Mod version"
            placeholder="1.0.0"
            value={modVersion}
            onChange={handleModVersionChange}
            required
            error={formErrors.modVersion && { content: formErrors.modVersion, pointing: 'above' }}
          />

          {modErrorId && (
            <Message negative>
              <Message.Header>Sorry, the mod could not be created.</Message.Header>
              <Message.Content>
                <br />
                Error ID: <b>{modErrorId}</b>
                <br />
                <br />
                You can check the error log for potential causes, or ask for help on Github or NexusMods. When asking
                for help, please include the error ID above.
              </Message.Content>
            </Message>
          )}

          <Header as="h3" size="medium">
            Installation
          </Header>
          <p>
            Either install the mod using{' '}
            <a href="https://www.nexusmods.com/about/vortex/" target="_blank" rel="noopener noreferrer">
              Vortex
            </a>{' '}
            (select "Install from file"), or unzip the downloaded file into Bannerlord's Modules folder.{' '}
            <a href="https://www.youtube.com/watch?v=LhTk_5Re4o8" target="_blank" rel="noopener noreferrer">
              See this video
            </a>{' '}
            for more information.
          </p>
          <p>
            It is recommended to install a mod that removes the the wanderer cap (like{' '}
            <a
              href="https://www.nexusmods.com/mountandblade2bannerlord/mods/264/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unlimited Wanderers
            </a>
            ) to ensure that the wanderers will show up in the game.
          </p>
          <p>
            For more information about what the ZIP contains, <Link to="/faq">check out the FAQ</Link>.
          </p>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button primary negative={hasErrors} onClick={handleDownload} loading={loading}>
          Download
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DownloadModal;
