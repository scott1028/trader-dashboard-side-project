import get from 'lodash/get';
import _ from 'lodash';

import { BUY_TYPE, SELL_TYPE, MIDDLE_ITEM, LIMIT } from '../../lib';

export const viewModelTransform = ({ prevState, data }) => {
  let accuValue = 0;
  let accuSize = 0;
  let maxCulmulativeTotal = 0;
  let buyQuotes = _.chain(data)
    .get('data.buyQuote', [])
    .map(item => ({
      ...item,
      culmulativeTotal: +get(item, 'culmulativeTotal'),
    }))
    .orderBy(['culmulativeTotal'], ['asc'])
    .take(LIMIT)
    .value()
    .map((item, idx, all) => {
      const sub = +get(item, 'price') * +get(item, 'size');
      accuValue += sub;
      accuSize += +get(item, 'size');
      const total = accuValue;
      const culmulativeTotal = get(item, 'culmulativeTotal');
      if (culmulativeTotal >= maxCulmulativeTotal) {
        maxCulmulativeTotal = culmulativeTotal;
      }
      return {
        ...item,
        type: BUY_TYPE,
        idx,
        sub,
        total,
        accuSize,
        avg: total / accuSize,
      }
    });
  accuValue = 0;
  accuSize = 0;
  let sellQuotes = _.chain(data)
    .get('data.sellQuote', [])
    .map(item => ({
      ...item,
      culmulativeTotal: +get(item, 'culmulativeTotal'),
    }))
    .orderBy(['culmulativeTotal'], ['asc'])
    .take(LIMIT)
    .map((item, idx) => ({ ...item, type: BUY_TYPE, idx })).map((item, idx, all) => {
      const sub = +get(item, 'price') * +get(item, 'size');
      accuValue += sub;
      accuSize += +get(item, 'size');
      const total = accuValue;
      const culmulativeTotal = get(item, 'culmulativeTotal');
      if (culmulativeTotal >= maxCulmulativeTotal) {
        maxCulmulativeTotal = culmulativeTotal;
      }
      return {
        ...item,
        type: SELL_TYPE,
        idx,
        sub,
        total,
        accuSize,
        avg: total / accuSize,
      }
    })
    .orderBy(['culmulativeTotal'], ['desc']).value();
  accuValue = null;

  // NOTE: occupied culmulativeTotal
  sellQuotes = sellQuotes.map(item => ({
    ...item,
    occupied: get(item, 'culmulativeTotal') / maxCulmulativeTotal,
  }));
  buyQuotes = buyQuotes.map(item => ({
    ...item,
    occupied: get(item, 'culmulativeTotal') / maxCulmulativeTotal,
  }));

  /*
   NOTE: According to document the API should provide information below
            ...
          "lastPrice": {
            "gains": -1.04,   <-- I need this, but not found in response
            "price": 55467.5
          },
            ...
         but I don't find it. Orz...
   */
  const lastPrice = +_.chain(data).get('data.lastPrice').value();
  const gain = _.chain(data).get('data.gain').value();
  const timestamp = _.chain(data).get('data.timestamp').value();
  const prev = {
    gain: _.chain(prevState).get('middle.curr.gain', null).value(),
    lastPrice: +_.chain(prevState).get('middle.curr.lastPrice', null).value(),
    timestamp: _.chain(prevState).get('middle.curr.timestamp', null).value(),
    rate: _.chain(prevState).get('middle.curr.rate', null).value(),
  }
  /* NOTE: Due to no `lastPrice.gains` in response so,
           just use previousPrice and currentPrice to calculate.
   */
  const rate = (lastPrice === prev.lastPrice) ? prev.rate : _.chain(lastPrice).divide(prev.lastPrice).value();
  const output = {
    ...prevState,
    buyQuotes,
    sellQuotes,
    middle: {
      prev,
      curr: {
        gain,
        lastPrice,
        timestamp,
        rate,
      },
      type: MIDDLE_ITEM,
    },
    timestamp,
  }
  return output;
};
