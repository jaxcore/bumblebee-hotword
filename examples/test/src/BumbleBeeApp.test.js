import React from 'react';
import ReactDOM from 'react-dom';
import BumbleBeeApp from './BumbleBeeApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BumbleBeeApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
