import { useCallback, useState } from 'react';
import { Button, Dropdown, Header, Icon, Popup } from 'semantic-ui-react';
import styled from 'styled-components';
import { useModOptions } from '../contexts/ModOptionsContext';
import { demoWanderers } from '../demoWanderers';
import useBooleanSetters from '../hooks/useBooleanSetters';
import useSortWanderers from '../hooks/useSortWanderers';
import { Wanderer } from '../types/wanderers';
import DownloadModal from './DownloadModal';
import LinkButton from './LinkButton';
import UploadModal from './UploadModal';
import WandererCard from './WandererCard';
import WandererModal from './WandererModal';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 20px;
  column-gap: 20px;

  @media screen and (max-width: 1220px) {
    grid-template-columns: auto auto;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: auto;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e1e1;
  margin-bottom: 12px;

  & > div > *:not(:last-child) {
    margin-right: 8px;
  }

  @media screen and (max-width: 768px) {
    justify-content: flex-end;

    & > div:first-of-type {
      display: none;
    }
  }
`;

const NoWanderersMessage = styled.div`
  width: 100%;
  color: rgba(37, 37, 37, 0.3);
  text-align: center;
  padding-top: 4em;
  font-size: 1.8em;
  line-height: 1.5em;

  & h3 {
    line-height: 1.5em;
    font-size: 3em;
  }

  & small {
    font-size: 0.6em;
  }
`;

const WandererPage = () => {
  const { wanderers, setWanderers } = useModOptions();
  const { sortedWanderers, sortValue, sortOptions, onSortChange } = useSortWanderers(wanderers);
  const [showNewWandererModal, setShowNewWandererModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [openNewWandererModal, closeNewWandererModal] = useBooleanSetters(setShowNewWandererModal);
  const [openDownloadModal, closeDownloadModal] = useBooleanSetters(setShowDownloadModal);
  const [openUploadModal, closeUploadModal] = useBooleanSetters(setShowUploadModal);

  const handleAddWanderer = useCallback(
    (wanderer: Wanderer) => {
      setWanderers((prevWanderers: Wanderer[]) => [...prevWanderers, wanderer]);
    },
    [setWanderers]
  );

  const handleUpdateWanderer = useCallback(
    (updatedWanderer) => {
      setWanderers((prevWanderers) => {
        const index = prevWanderers.findIndex((c) => c.id === updatedWanderer.id);

        if (index === -1) {
          return prevWanderers;
        }

        return [...prevWanderers.slice(0, index), updatedWanderer, ...prevWanderers.slice(index + 1)];
      });
    },
    [setWanderers]
  );

  const handleDeleteWanderer = useCallback(
    (id) => {
      setWanderers((prevWanderers) => {
        const index = prevWanderers.findIndex((c) => c.id === id);
        return [...prevWanderers.slice(0, index), ...prevWanderers.slice(index + 1)];
      });
    },
    [setWanderers]
  );

  const loadDemoWanderers = useCallback(() => {
    setWanderers(demoWanderers);
  }, [setWanderers]);

  return (
    <>
      <ActionBar>
        <div>
          <Header as="h2" size="large">
            Wanderers
          </Header>
        </div>
        <div>
          <span>
            Sort by <Dropdown label="Test" onChange={onSortChange} value={sortValue} options={sortOptions} inline />
          </span>
          <Button size="small" onClick={openUploadModal}>
            <Icon name="upload" />
            Load
          </Button>
          <Button size="small" onClick={openDownloadModal} disabled={wanderers.length <= 0}>
            <Icon name="download" />
            Download
          </Button>

          <Popup
            pinned
            on="click"
            position="bottom center"
            trigger={
              <Button size="small" color="red" disabled={wanderers.length === 0}>
                <Icon name="remove" />
                Clear
              </Button>
            }
            content={
              <span>
                Are you sure? All wanderers will be removed.{' '}
                <LinkButton onClick={() => setWanderers([])}>Confirm</LinkButton>
              </span>
            }
          />
          <Button size="small" onClick={openNewWandererModal} primary>
            <Icon name="plus" />
            New wanderer
          </Button>
        </div>
      </ActionBar>

      {sortedWanderers.length > 0 ? (
        <StyledGrid>
          {sortedWanderers.map((wanderer: Wanderer) => (
            <WandererCard
              key={wanderer.id}
              wanderer={wanderer}
              onUpdate={handleUpdateWanderer}
              onDelete={handleDeleteWanderer}
            />
          ))}
        </StyledGrid>
      ) : (
        <NoWanderersMessage>
          <h3>Where is everyone?</h3>
          <p>
            Load a mod or press <i>New wanderer</i> to add one.
            <br />
            <small>
              (I'm panicking,{' '}
              <LinkButton style={{ opacity: 0.8 }} onClick={loadDemoWanderers}>
                load some examples
              </LinkButton>{' '}
              for me!)
            </small>
          </p>
        </NoWanderersMessage>
      )}

      {showNewWandererModal && <WandererModal open onUpdate={handleAddWanderer} onClose={closeNewWandererModal} />}
      {showDownloadModal && <DownloadModal open onClose={closeDownloadModal} />}
      {showUploadModal && <UploadModal open onClose={closeUploadModal} />}
    </>
  );
};

export default WandererPage;
