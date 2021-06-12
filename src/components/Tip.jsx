import styled from 'styled-components';
import numeral from 'numeral';

import { SELL_TYPE } from '../lib';

const Wrapper = styled.div`
  position: absolute;
  right: 0px;
  display: flex;
  width: 100%;
  top: ${props => {
    if (props.type === SELL_TYPE) {
      return '-75%';
    }
    return '25%;';
  }};
`;

export const FlexWrapper = styled.div`
  display: flex;
`;

export const Triangle = styled.div`
  position: absolute;
  right: -11px;
  top: 0%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 10px 0;
  border-color: transparent #57626E;
`;

export const TipWrapper = styled.div`
  padding: 10px 10px 10px 10px;;
  background-color: #57626E;
  border-radius: 3px;
  color: rgb(255, 255, 255);
  border: unset;
  box-shadow: unset;
  position: absolute;
  right: -10px;
  transform: translateX(100%) translateY(-24%);
  overflow: hidden;
  white-space: nowrap;
`;

export const FlexChild = styled.div`
  flex: 1;
  text-align: left;
  padding-right: 10px;
  &:last-child {
    padding-right: 0px;
  }
`;

export const Tip = ({ item, type }) => {
  const { avg, total } = item;
  return (
    <Wrapper type={type}>
      <Triangle />
      <TipWrapper>
        <FlexWrapper>
          <FlexChild>Avg Price:</FlexChild>
          <FlexChild>{ numeral(avg).format('0,0.0') } USD</FlexChild>
        </FlexWrapper>
        <FlexWrapper>
          <FlexChild>Total Value:</FlexChild>
          <FlexChild>{ numeral(total).format('0,0.0') } USD</FlexChild>
        </FlexWrapper>
      </TipWrapper>
    </Wrapper>
  );
};
