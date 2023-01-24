import styled from 'styled-components';

export const SummaryWrapper = styled.div`
  margin-top: 40px;
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
  }
  @media screen and (min-width: 1280px) {
    display: none;
  }
`;

export const Container = styled.main`
  position: relative;
  overflow: hidden;
  padding: 40px 20px 80px 20px;
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */

  text-align: center;

  @media screen and (min-width: 768px) {
    padding: 49px 32px 60px 32px;
  }

  @media screen and (min-width: 1280px) {
    padding: 40px 91px 85px 91px;
  }
`;

export const AnimationWrapper = styled.div`
  display: none;

  @media screen and (min-width: 1280px) {
    position: absolute;
    bottom: 20px;
    left: 0;
    z-index: -1000;
    height: 100vh;
    width: 100%;
  }
`;
