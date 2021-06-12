import styled from 'styled-components';
import React, { memo } from 'react';
import get from 'lodash/get';

import { ReactComponent as IconArrowDown } from '../IconArrowDown.svg';
import numeral from 'numeral';

const MiddleWrapper = styled.div`
  width: 100%;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => {
    if (props.gain > 0) {
      return 'rgba(0, 177, 93, 0.2)';
    }
    return 'rgba(255, 91, 90, 0.2)';
  }};
  color: ${props => {
    if (props.gain > 0) {
      return '#00b15d';
    }
    return '#FF5B5A';
  }};
  & > * {
    padding-right: 5px;
  }
  & > *:last-child {
    padding-right: 0px;
  }
`;

const RectWrapper = styled.div`
  border: ${props => {
    if (props.gain > 0) {
      return '2px solid #00b15d';
    }
    return '2px solid #FF5B5A';
  }};
  border-radius: 2px;
  padding-left: 5px;
  padding-right: 5px;
`;

const StyledIconArrowDown = styled(({ className, gain }) => {
  return (
    <div className={className}>
      <IconArrowDown />
    </div>
  )
})`
  transform: ${props => {
    if (props.gain > 0) {
      return 'rotateZ(180deg)';
    }
    return 'rotateZ(0deg) translateX(15%)';
  }};
  zoom: 0.75;
  display: flex;
`;

const percentageGetter = rate =>
  (rate === Infinity) // NOTE: if no previous price we will get this.
  ?
  numeral(0).format('0.00 %')
  :
  numeral(rate - 1).format('0.00 %').replace('-', '- ');

export const MiddleItem = memo(({ item }) => {
  const gain = get(item, 'curr.gain', 0);
  const rate = get(item, 'curr.rate', 0);
  const lastPrice = get(item, 'curr.lastPrice', 0);
  const percentage = percentageGetter(rate);
  if (gain > 0) {
    return (
      <MiddleWrapper gain={gain}>
        <div>{ lastPrice }</div>
        <div><StyledIconArrowDown gain={gain} /></div>
        <div><RectWrapper gain={gain}>{ percentage }</RectWrapper></div>
      </MiddleWrapper>
    )
  } else {
    return (
      <MiddleWrapper gain={gain}>
        <div>{ lastPrice }</div>
        <div><StyledIconArrowDown gain={gain} /></div>
        <div><RectWrapper gain={gain}>{ percentage }</RectWrapper></div>
      </MiddleWrapper>
    )
  }
});
