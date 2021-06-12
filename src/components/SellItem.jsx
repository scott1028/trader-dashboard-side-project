import styled from 'styled-components';
import React, { memo } from 'react';
import numeral from 'numeral';

import { RowItem } from './RowItem';

const SellWrapper = memo(styled.div`
  color: #FF5B5A;
`);

export const SellItem = memo(({ item, hoveredTarget }) => {
  const price = numeral(item.price).format('0,0.0');
  return (
    <RowItem item={item} hoveredTarget={hoveredTarget}>
      <SellWrapper>
        { price }
      </SellWrapper>
    </RowItem>
  );
});
