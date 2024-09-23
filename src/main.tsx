import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';


import App from './App';
import React from 'react';

// Use createRoot instead of ReactDOM.render
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(

    <Router>
      <App />

    </Router>
  );
} else {
  console.error('Root element not found');
}
