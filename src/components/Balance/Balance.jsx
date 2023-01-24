import { BalanceContainer, StyledLink, ReportsSvg } from './Balance.styled';
import svg from '../../images/icons_sprite.svg';
import { BalanceFrom } from './BalanceForm';

export function Balance() {
  return (
    <BalanceContainer>
      <BalanceFrom btnDisplay={true} />
      <StyledLink to="/statistics">
        Reports
        <ReportsSvg>
          <use href={`${svg}#reports`}></use>
        </ReportsSvg>
      </StyledLink>
    </BalanceContainer>
  );
}
