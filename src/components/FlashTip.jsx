import styled from 'styled-components';
import React, { useState, useEffect, memo } from 'react';

import {
  SELL_TYPE,
} from '../lib';

const COMPONENT_FRAME = 250;

const Hoo = styled.div`
  @keyframes appeared {
    0%   { opacity: 0; }
    50%  { opacity: 1; }
    100% { opacity: 0; }
  }
  position: absolute;
  background-color: ${props => {
    if (props.type === SELL_TYPE) {
      return '#FF5B5A;'; 
    }
    return '#00b15d;';
  }}
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  animation: appeared .${COMPONENT_FRAME}s forwards;
`;

export const FlashTip = memo(({ value, type, disabled }) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
    setTimeout(() => setActive(false), Math.max(COMPONENT_FRAME, 250));
  }, [setActive, value]);
  return (
    active && !disabled ? <Hoo type={type} /> : null
  );
});
