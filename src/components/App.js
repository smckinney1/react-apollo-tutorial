import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from './Header';
import CreateLink from './CreateLink';
import LinkList from './LinkList';

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" component={LinkList} />
          <Route exact path="/create" component={CreateLink} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
