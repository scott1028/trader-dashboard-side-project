import get from 'lodash/get';
import _ from 'lodash';
import fetch from 'node-fetch';

import { BUY_TYPE, SELL_TYPE, FRAME_FPS } from '../../lib';
import { viewModelTransform } from './transform';

const SYMBOL = 'BTC-USD_0';

export const testHover = ({ target, viewState }) => {
  if (!target) return null;
  const { idx, type } = target;
  if (idx === null) return null;
  const { buyQuotes, sellQuotes } = viewState;
  let edgeIdx = null;
  if (type === BUY_TYPE) {
    const hoverAccu = +buyQuotes[idx].culmulativeTotal
    const data = sellQuotes.filter(item => +item.culmulativeTotal <= hoverAccu);
    const edgeItem = _.chain(data).maxBy(item => +item.culmulativeTotal).value();
    if (hoverAccu > +get(edgeItem, 'culmulativeTotal')) {
      edgeIdx = get(edgeItem, 'idx', 0) + 1;
    } else {
      edgeIdx = get(edgeItem, 'idx', 0);
    }
    return {
      buyEdgeIdx: idx,
      sellEdgeIdx: edgeIdx,
    };
  } else if(type === SELL_TYPE) {
    const hoverAccu = +_.chain(sellQuotes).cloneDeep().value().reverse()[idx].culmulativeTotal
    const data = buyQuotes.filter(item => +item.culmulativeTotal <= hoverAccu);
    const edgeItem = _.chain(data).maxBy(item => +item.culmulativeTotal).value();
    if (hoverAccu > +get(edgeItem, 'culmulativeTotal')) {
      edgeIdx = get(edgeItem, 'idx', 0) + 1;
    } else {
      edgeIdx = get(edgeItem, 'idx', 0);
    }
    return {
      buyEdgeIdx: edgeIdx,
      sellEdgeIdx: idx,
    };
  }
}

export const dataUpdaterByWebSocket = ({ setViewState }) => {
  const ws = new WebSocket('wss://ws.btse.com/ws/spot');
  // NOTE: Make FPS limit for updating
  const callback = _.chain(setViewState)
    .throttle(FRAME_FPS)
    .value();
  ws.onopen = () => {
    ws.send(JSON.stringify({
      "op": "subscribe",
      "args": [`orderBook:${SYMBOL}`]
    }));
    ws.onmessage = ({ data }) => {
      const jsonData = JSON.parse(data);
      if (_.chain(jsonData).get('topic').value() !== `orderBook:${SYMBOL}`) {
        console.log('skip');
        return;
      }
      callback(prevState => viewModelTransform({
        prevState,
        data: jsonData,
      }));
    }
  }
};

export const dataInitByRestAPI = async () => {
  const resp = await fetch(`/api/init/initOrderBook?market=${SYMBOL}`);
  const output = await resp.json();
  return output;
};
