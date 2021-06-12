import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import _ from 'lodash';

import { Wrapper, AnchorDivWidhtPadding, AnchorDiv } from '../Common';
import { MiddleItem } from '../MiddleItem';
import { BuyItem } from '../BuyItem';
import { SellItem } from '../SellItem';

import { BUY_TYPE, SELL_TYPE, MIDDLE_ITEM } from '../../lib';
import { testHover, dataUpdaterByWebSocket, dataInitByRestAPI } from './lib';
import { viewModelTransform } from './transform';

const componentAdatper = {
  [BUY_TYPE]: BuyItem,
  [SELL_TYPE]: SellItem,
  [MIDDLE_ITEM]: MiddleItem,
}

const HeaderWrapper = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: rgb(134, 152, 170);
`;

export const OrderBook = () => {
  const [viewState, setViewState] = useState({});
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const getInitData = async () => {
    const output = await dataInitByRestAPI();
    setViewState(prevState => viewModelTransform({ prevState, data: output }));
    // NOTE: disable/enable webSocket
    dataUpdaterByWebSocket({ setViewState });
  };

  const onRowHover = useCallback(data => {
    setHoveredTarget(data);
  }, []);

  const onRowBlur = useCallback(() => {
    setHoveredTarget(null);
  }, []);

  useEffect(() => {
    getInitData();
  }, []);
  const { buyEdgeIdx = null, sellEdgeIdx = null } = testHover({ target: hoveredTarget, viewState }) || {};
  const { buyQuotes, sellQuotes, middle } = viewState;
  return (
    <Wrapper>
      <HeaderWrapper>
        <AnchorDiv>Price USD</AnchorDiv>
        <AnchorDiv>Size</AnchorDiv>
        <AnchorDiv>Total</AnchorDiv>
      </HeaderWrapper>
      {
        [sellQuotes, middle, buyQuotes].flatMap(item => item).map((item, idx) => {
          if (!item) return null;
          const { type, idx: itemIdx } = item;
          const Component = _.chain(componentAdatper).get(type).value();
          let highlighted = false;
          if (sellEdgeIdx !== null && type === SELL_TYPE) {
            highlighted = sellEdgeIdx >= itemIdx;
          } else if (sellEdgeIdx !== null && type === BUY_TYPE) {
            highlighted = buyEdgeIdx >= itemIdx;
          }
          return (
            <AnchorDivWidhtPadding
              className="row"
              highlighted={highlighted}
              key={idx}
              style={styled}
              onMouseEnter={() => onRowHover({ idx: item.idx, type: item.type })}
              onMouseLeave={() => onRowBlur({ idx: item.idx, type: item.type })}>
              <Component item={item} hoveredTarget={hoveredTarget} />
            </AnchorDivWidhtPadding>
          )
        })
      }
    </Wrapper>
  );
};
