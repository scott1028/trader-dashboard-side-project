export const highlightStrategy = ({ previousPrice, previousSize, price, size }) => {
  let isPriceHightlight = false;
  let isSizeHightlight = false;
  /*  */ if (price > previousPrice && size >= previousSize) {
    // NOTE: highlight whole row
    isPriceHightlight = true;
  } else if (price > previousPrice && size < previousSize) {
    // NOTE: highlight whole row & size ceil
    isPriceHightlight = true;
    isSizeHightlight = true;
  } else if (price < previousPrice && size <= previousSize) {
    // NOTE: highlight whole row
    isPriceHightlight = true;
  } else if (price < previousPrice && size > previousSize) {
    // NOTE: highlight whole row & size ceil
    isPriceHightlight = true;
    isSizeHightlight = true;
  }
  return {
    isPriceHightlight,
    isSizeHightlight,
  }
};

export const disabledStrategy = ({ isHover, isRowHightlight = false, isCellHightlight = false }) => {
  /*  */ if (isHover) {
    return true;
  } else if (isRowHightlight && !isCellHightlight) {
    return false;
  } else if (!isRowHightlight && isCellHightlight) {
    return false;
  }
  return true;
}
