import React, { useState, memo } from 'react';
import numeral from 'numeral';

import { RowWrapper, AnchorDiv, OccupiedBackground } from '../Common';
import { Tip } from '../Tip';
import { FlashTip } from '../FlashTip';
import { usePrevious } from '../../lib/usePrevious';
import { SELL_TYPE, BUY_TYPE } from '../../lib';
import { highlightStrategy, disabledStrategy } from './lib';

export const RowItem = memo(({ item, hoveredTarget, children }) => {
  const [isToggle, setToggle] = useState(false);
  const price = numeral(item.price).format('0,0.0');
  const size = numeral(item.size).format('0,0.00000');
  const total = numeral(item.culmulativeTotal).format('0,0.00000');
  const previousSize = usePrevious(size);
  const previousPrice = usePrevious(price);
  const {
    isPriceHightlight: isRowHightlight,
    isSizeHightlight: isCellHightlight,
  } = highlightStrategy({
    previousPrice, previousSize, price, size,
  });
  return (
    <RowWrapper
      onMouseEnter={() => setToggle(true)}
      onMouseLeave={() => setToggle(false)}>
      { isToggle && <Tip item={item} type={item.type} />}
      <FlashTip
        value={price}
        type={item.type}
        disabled={disabledStrategy({
          isHover: hoveredTarget,
          isRowHightlight: true,
        })} />
      <AnchorDiv>
        { children }
      </AnchorDiv>
      <AnchorDiv>
        <FlashTip
          value={size}
          prev={previousSize}
          type={size < previousSize ? BUY_TYPE : SELL_TYPE}
          disabled={disabledStrategy({
            isHover: hoveredTarget,
            isRowHightlight,
            isCellHightlight,
          })} />
          { size }
      </AnchorDiv>
      <AnchorDiv>
        <OccupiedBackground item={item} />
        { total }
      </AnchorDiv>
    </RowWrapper>
  )
});
