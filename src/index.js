import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reducers from './reducers';
import App from './components/App';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import VisibleCards from './components/VisibleCards';
import NewCardModal from './components/NewCardModal';
import EditCardModal from './components/EditCardModal';
import StudyModal from './StudyModal';

import * as localStore from './localStorage';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers), localStore.get());
const history = syncHistoryWithStore(browserHistory, store);
const routes = (
  <Route path='/' component={App}>
    <Route path='/deck/:deckId' component={VisibleCards}>
      <Route path='/deck/:deckId/new' component={NewCardModal}></Route>
      <Route path='/deck/:deckId/edit/:cardId' component={EditCardModal}></Route>
      <Route path='/deck/:deckId/study' component={StudyModal}></Route>
    </Route>
  </Route>
);

function run () {
  let state = store.getState();
  localStore.set(state, ['decks', 'cards']);
  console.log(state);
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        {routes}
      </Router>
    </Provider>
  ), document.getElementById('root'));
}

run();

store.subscribe(run);


