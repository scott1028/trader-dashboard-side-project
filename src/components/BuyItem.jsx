import styled from 'styled-components';
import React, { memo } from 'react';
import numeral from 'numeral';

import { RowItem } from './RowItem';

const BuyWrapper = memo(styled.div`
  color: #00b15d;
`);

export const BuyItem = memo(({ item, hoveredTarget }) => {
  const price = numeral(item.price).format('0,0.0');
  return (
    <RowItem item={item} hoveredTarget={hoveredTarget}>
      <BuyWrapper>
        { price }
      </BuyWrapper>
    </RowItem>
  );
});
