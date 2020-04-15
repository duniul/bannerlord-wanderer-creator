import React, { useCallback, useMemo, useState } from 'react';
import { Button, Item, Popup, Segment, SemanticSIZES } from 'semantic-ui-react';
import styled from 'styled-components';
import useBooleanSetters from '../hooks/useBooleanSetters';
import { CultureLabels, EquipmentLabels } from '../strings';
import { Wanderer } from '../types/wanderers';
import { Culture } from '../types/culture';
import { Trait, Traits } from '../types/traits';
import { sumSkillPoints } from '../utils/skills';
import WandererAvatar from './WandererAvatar';
import WandererModal from './WandererModal';
import TraitTag from './TraitTag';
import LinkButton from './LinkButton';

interface WandererCardProps {
  wanderer: Wanderer;
  onUpdate: (wanderer: Wanderer) => void;
  onDelete: (id: string) => void;
}

interface CultureBackgroundImageProps {
  culture: Culture;
}

const CultureBackgroundImage = styled.img.attrs<CultureBackgroundImageProps>(({ culture }) => ({
  src: `images/culture/${culture}.jpg`,
}))<CultureBackgroundImageProps>`
  position: absolute;
  transform: rotate(15deg);
  opacity: 0.15;
  top: -20px;
  right: -110px;
`;

const WrapperSegment = styled(Segment)`
  overflow: hidden;
  margin: 0 !important;

  & > .items {
    margin-bottom: 0;
  }

  & div {
    z-index: 1;
  }
`;

const TraitsArea = styled.div`
  & > div {
    margin-top: 7px;
  }
`;

const ActionsArea = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 6px;

  & > button:not(:last-of-type) {
    margin-right: 8px;
  }
`;

const MAX_QUOTE_LENGTH = 85;

const actionButtonDefaults = {
  size: 'tiny' as SemanticSIZES,
  circular: true,
};

function renderTraits(traits?: Traits): JSX.Element[] {
  return Object.entries(traits || [])
    .map(([trait, value]) => <TraitTag key={trait} trait={trait as Trait} value={value} />)
    .filter(Boolean);
}

const WandererCard = React.memo<WandererCardProps>(
  ({ wanderer, onUpdate, onDelete }): JSX.Element => {
    const { id, name, isFemale, culture, skills, traits, battleTemplate, dialogue } = wanderer;
    const [active, setActive] = useState<boolean>(false);
    const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
    const [visibleModal, setVisibleModal] = useState<boolean>(false);

    const [activate, deactivate] = useBooleanSetters(setActive);
    const [openPopup, closePopup] = useBooleanSetters(setVisiblePopup);
    const [openModal, closeModal] = useBooleanSetters(setVisibleModal);

    const traitLabels = useMemo(() => renderTraits(traits), [traits]);

    const backstoryQuote = dialogue?.backstory_a || '';

    const handleDelete = useCallback(() => {
      onDelete(id);
    }, [id, onDelete]);

    return (
      <WrapperSegment raised={active} onMouseMove={activate} onMouseLeave={deactivate}>
        <Item.Group unstackable>
          <Item>
            <WandererAvatar as={Item.Image} size="tiny" culture={culture} isFemale={isFemale} />

            <Item.Content>
              <Item.Header>{name}</Item.Header>
              <Item.Meta>
                {isFemale ? 'Female' : 'Male'} {CultureLabels[culture]} ∙ {sumSkillPoints(skills)} skill points
              </Item.Meta>
              <Item.Meta style={{ marginBottom: 0 }}>{EquipmentLabels[battleTemplate]}</Item.Meta>
              <TraitsArea>{traitLabels}</TraitsArea>
              <Item.Description>
                <i>
                  "{backstoryQuote.slice(0, MAX_QUOTE_LENGTH)}
                  {!backstoryQuote || backstoryQuote.length > MAX_QUOTE_LENGTH ? '...' : ''}"
                </i>
              </Item.Description>
              {(active || visiblePopup) && (
                <ActionsArea>
                  <Button
                    {...actionButtonDefaults}
                    primary
                    icon="pencil"
                    onClick={openModal}
                    onFocus={activate}
                    onBlur={deactivate}
                  />
                  <Popup
                    content={
                      <span>
                        Are you sure? <LinkButton onClick={handleDelete}>Delete</LinkButton>
                      </span>
                    }
                    on="click"
                    pinned
                    position="bottom center"
                    onOpen={openPopup}
                    onClose={closePopup}
                    trigger={<Button {...actionButtonDefaults} negative icon="trash" />}
                  />
                </ActionsArea>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
        <CultureBackgroundImage culture={culture} />
        {visibleModal && (
          <WandererModal wanderer={wanderer} open={visibleModal} onUpdate={onUpdate} onClose={closeModal} />
        )}
      </WrapperSegment>
    );
  }
);

export default WandererCard;
