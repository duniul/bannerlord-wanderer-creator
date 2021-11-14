import React, { useMemo } from 'react';
import { Comment, Input, InputProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { Dialogue } from '../types/wanderers';
import { Culture } from '../types/culture';
import WandererAvatar from './WandererAvatar';

interface WandererDialogueProps {
  dialogue: Dialogue;
  name?: string;
  culture: Culture;
  isFemale: boolean;
  onChange: (event: React.FormEvent<HTMLInputElement>, data: InputProps) => void;
}

interface DialogCommentProps {
  name: string;
  description: string;
  avatar: JSX.Element;
  value?: string;
  inputId?: string;
  indent?: boolean;
  onChange?: (event: React.FormEvent<HTMLInputElement>, data: InputProps) => void;
}

const StyledCommentGroup = styled(Comment.Group)`
  max-width: 100% !important;
`;

const StyledComment = styled(Comment)`
  ${(props) => (props.$indent ? 'margin-left: 60px !important;' : '')}
`;

const DialogueComment = React.memo(
  ({ name, inputId, description, avatar, value, indent, onChange }: DialogCommentProps) => {
    return (
      <StyledComment $indent={indent}>
        {avatar}
        <Comment.Content>
          <Comment.Author as="span">{name}</Comment.Author>
          <Comment.Metadata>
            <div>{description}</div>
          </Comment.Metadata>
          {inputId ? (
            <Input fluid id={inputId} name={inputId} value={value} onChange={onChange} />
          ) : (
            <Comment.Text>{value}</Comment.Text>
          )}
        </Comment.Content>
      </StyledComment>
    );
  }
);

const playerAvatar = <WandererAvatar as={Comment.Avatar} />;

const WandererDialogue = ({ dialogue, name, culture, isFemale, onChange }: WandererDialogueProps) => {
  const wandererAvatar = useMemo(() => <WandererAvatar as={Comment.Avatar} culture={culture} isFemale={isFemale} />, [
    culture,
    isFemale,
  ]);

  const wandererCommentProps = { name: name || 'Wanderer', avatar: wandererAvatar, onChange };
  const playerCommentProps = { name: 'Player', avatar: playerAvatar, indent: true, onChange };

  return (
    <StyledCommentGroup size="large">
      <DialogueComment
        {...wandererCommentProps}
        description="Generic first line"
        value="What is it, stranger? Who're you?"
      />

      <DialogueComment
        {...playerCommentProps}
        description="Nice intro response"
        value={`My name is {PLAYER.NAME}, ${isFemale ? 'madam' : 'sir'}. Tell me about yourself.`}
      />

      <DialogueComment
        {...playerCommentProps}
        description="Rude intro response"
        value="I'm {PLAYER.NAME}. Let's skip the pleasantries and get right to business."
      />

      <DialogueComment
        {...wandererCommentProps}
        description="Pre backstory"
        inputId="dialogue.prebackstory"
        value={dialogue?.prebackstory}
      />

      <DialogueComment
        {...wandererCommentProps}
        description="Backstory, part 1"
        inputId="dialogue.backstory_a"
        value={dialogue?.backstory_a}
      />

      <DialogueComment
        {...wandererCommentProps}
        description="Backstory, part 2"
        inputId="dialogue.backstory_b"
        value={dialogue?.backstory_b}
      />

      <DialogueComment
        {...wandererCommentProps}
        description="Backstory, part 3"
        inputId="dialogue.backstory_c"
        value={dialogue?.backstory_c}
      />

      <DialogueComment
        {...playerCommentProps}
        description="Backstory response, option 1"
        inputId="dialogue.response_1"
        value={dialogue.response_1}
      />

      <DialogueComment
        {...playerCommentProps}
        description="Backstory response, option 2"
        inputId="dialogue.response_2"
        value={dialogue.response_2}
      />

      <DialogueComment
        {...wandererCommentProps}
        description="Wanderer response/offer"
        inputId="dialogue.backstory_d"
        value={dialogue.backstory_d}
      />

      <DialogueComment
        {...playerCommentProps}
        description="Backstory response, option 2"
        value="I can use someone like you in my company."
      />
    </StyledCommentGroup>
  );
};

export default WandererDialogue;
