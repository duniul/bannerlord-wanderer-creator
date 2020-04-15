import styled from 'styled-components';
import { Culture } from '../types/culture';

interface WandererAvatarProps {
  isFemale?: boolean;
  culture?: Culture;
  width?: string | number;
}

export const AvatarColors: { [K in Culture]: string } = {
  [Culture.Aserai]: '#b28540',
  [Culture.Battania]: '#5b814b',
  [Culture.Empire]: '#8c81c9',
  [Culture.Khuzait]: '#4aaa99',
  [Culture.Sturgia]: '#4b76ae',
  [Culture.Vlandia]: '#b7675b',
};

// @ts-ignore
const WandererAvatar = (styled.img as any)
  .withConfig({
    shouldForwardProp: (prop: any) => !['isFemale', 'culture'].includes(prop),
  })
  .attrs<WandererAvatarProps>(({ isFemale }: any) => ({
    src: `images/avatar/${isFemale ? 'female' : 'male'}.png`,
  }))<WandererAvatarProps>`
  & > img {
    border-radius: 50px !important;
    box-shadow: 0 2px 10px 0 rgba(34, 36, 38, 0.25);
    background: ${(props: any) => (props.culture ? AvatarColors[props.culture as Culture] : '#686868')};
  }
`;

export default WandererAvatar;
