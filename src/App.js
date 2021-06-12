import React from 'react';
import styled from 'styled-components';

import { OrderBook } from './components/OrderBook';

import './App.css';

const WidgetWrapper = styled.div`
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  width: 300px;
`;

function App() {
  return (
    <WidgetWrapper className="App">
      <OrderBook />
    </WidgetWrapper>
  );
}

export default App;
