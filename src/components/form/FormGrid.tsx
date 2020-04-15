import styled from 'styled-components';

const FormGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 3}, 1fr);
  column-gap: 20px;
`;

export default FormGrid;
