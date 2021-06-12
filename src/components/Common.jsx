import styled from 'styled-components';
import numeral from 'numeral';

import {
  SELL_TYPE,
} from '../lib';

export const Wrapper = styled.div`
  position: relative;
  background-color: #1e2c4c;
  color: #fff;
  text-align: right;
`;

export const AnchorDivWidhtPadding = styled.div`
  position: relative;
  background-color: ${props => {
    if (props.highlighted) {
      return 'rgba(51, 69, 115, 1)'; 
    }
    return 'inherit';
  }}
`;

export const AnchorDiv = styled(AnchorDivWidhtPadding)`
  padding-right: 5px;
`;

export const RowWrapper = styled.div`
  width: 100%;
  &:hover {
    background-color: #334573;
  }
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
`;

export const OccupiedBackground = styled.div`
  top: 0px;
  opacity: 0.2;
  height: 100%;
  position: absolute;
  background-color: ${props => {
    if (props.item.type === SELL_TYPE) {
      return '#FF5B5A;'; 
    }
    return '#00b15d;';
  }}
  width: ${props => {
    return numeral(props.item.occupied).format('0%');
  }}
`;

