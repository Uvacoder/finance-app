import styled from 'styled-components';

export const ShowFormBtn = styled.button`
  width: 30px;
  height: 30px;
  background-color: ${p => p.theme.colors.PrimaryOrange};
  position: absolute;
  /* z-index: ; */
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  border-bottom-left-radius: 16px;
  border-top-right-radius: 16px;
  color: ${p => p.theme.colors.PrimaryWhite};

  &:active {
    border-bottom-right-radius: 16px;
    border-top-left-radius: 16px;
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`;
