import { useSelector } from 'react-redux';
import svg from '../../images/icons_sprite.svg';
import styledComponents from 'components/Expenses/styleExpenses';
import { Chart } from 'components/Chart/Chart';
import { useState } from 'react';
import { formattingSum } from 'utils/formattingSum';

const {
  ListOfBalanceChanges,
  ItemOfBalanceChanges,
  TitleOfBalanceChanges,
  SvgBoxStyle,
  BtnToggleStats,
  BoxForSvg,
  BoxStats,
  BoxForSchedule,
} = styledComponents;

const Income = ({ onClick }) => {
  const statistics = useSelector(state => state.statistics.statistics);
  const [filter, setFilter] = useState();

  if (!statistics) {
    return <TitleOfBalanceChanges>"No data to display!"</TitleOfBalanceChanges>;
  }

  const {
    incomes: {
      incomesData: {
        // eslint-disable-next-line no-useless-computed-key
        ['З/П']: salary,
        // eslint-disable-next-line no-useless-computed-key
        ['Доп. доход']: income,
      },
      incomeTotal,
    },
  } = statistics.data;

  const onItemClick = event => {
    setFilter(event.currentTarget.id);
  };
  const filtredData = () => {
    const data = statistics.data.incomes.incomesData;

    if (!data) return;
    if (!filter) return;

    const [, incomes] = Object.entries(data).filter(
      el => el[0] === filter
    )[0] || [null, false];

    const res = Object.entries(incomes)
      .filter(el => {
        return el[0] !== 'total';
      })
      .map(el => {
        return { name: el[0], cost: el[1] };
      });

    if (res.length === 0) {
      return null;
    }
    return res;
  };

  return (
    <>
      <BoxStats>
        <div>
          <BtnToggleStats type="button" onClick={onClick}>
            <svg width="10" height="10">
              <use href={`${svg}#arrow_left`} />
            </svg>
          </BtnToggleStats>
          <TitleOfBalanceChanges>Income</TitleOfBalanceChanges>
          <BtnToggleStats type="button" onClick={onClick}>
            <svg width="10" height="10">
              <use href={`${svg}#arrow_right`} />
            </svg>
          </BtnToggleStats>
        </div>
        {incomeTotal ? (
          <ListOfBalanceChanges>
            {salary && (
              <ItemOfBalanceChanges onClick={onItemClick} id="З/П">
                <p>{formattingSum(salary.total)}</p>
                <BoxForSvg>
                  {' '}
                  <SvgBoxStyle>
                    <use href={`${svg}#salary`} />
                  </SvgBoxStyle>
                </BoxForSvg>
                <p>Salary</p>
              </ItemOfBalanceChanges>
            )}
            {income && (
              <ItemOfBalanceChanges onClick={onItemClick} id="Доп. доход">
                <p>{formattingSum(income.total)}</p>
                <BoxForSvg>
                  <SvgBoxStyle>
                    <use href={`${svg}#income`} />
                  </SvgBoxStyle>
                </BoxForSvg>
                <p>Add. income</p>
              </ItemOfBalanceChanges>
            )}
          </ListOfBalanceChanges>
        ) : (
          <TitleOfBalanceChanges>"No data to display!"</TitleOfBalanceChanges>
        )}
      </BoxStats>
      {filtredData() && (
        <BoxForSchedule>
          <Chart data={filtredData()} />
        </BoxForSchedule>
      )}
    </>
  );
};

export default Income;
