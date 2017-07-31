import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../css/index.css';

import { MIXPANEL_KEY } from "./mixpanelkey.js";
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';

mixpanel.init(MIXPANEL_KEY)

ReactDOM.render(
  <MixpanelProvider mixpanel={mixpanel}>
    <App />
  </MixpanelProvider>,
  document.getElementById('root')
);
