import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from './Header';
import CreateLink from './CreateLink';
import LinkList from './LinkList';
import Login from './Login';
import Search from './Search';

function App() {
  return (
    <div className="center w85 avenir">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/new/1" />} />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/new/:page" component={LinkList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
