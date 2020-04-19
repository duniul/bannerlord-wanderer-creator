import React from 'react';
import ReactDOM from 'react-dom';
import 'array-flat-polyfill';
import 'semantic-ui-css/semantic.min.css';
import{ init as initSentry } from '@sentry/browser';
import * as serviceWorker from './serviceWorker';
import App from './App';

initSentry({dsn: "https://6449a6a027d948eba6ef50a4b945edfb@o380174.ingest.sentry.io/5205712"});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
