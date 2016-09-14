# Modern Webapps with React and Redux

## Project Setup

- `npm init --yes` to start package.json with default settings
- `npm i -S babel-preset-react babel-preset-es2015 watchify babelify live-server react react-dom redux`
- mkdir public src
- touch src/index.html src/app.js

> package.json

```javascript
"scripts": {
    "build": "watchify src/app.js -o public/bundle.js -t [ babelify --presets [ react es2015] ]",
    "server": "cd public; live-server --port=8000 --entry-file=index.html"
  }
```

> src/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flashcard App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
</html>
```

> src/app.js

```javascript
console.log('hello world');
```

## Reducers and Actions

### State

A set of values that describe the app as the user sees it right now.
State represents both the data (cards, decks in this course) and UI state (selectedDeck, studyModeActivated).
State isn't managed by React because React is just a view library. To manage our app state we'll need Redux stores.

> src/app.js

```javascript
// creating a Redux store

import {createStore} from 'redux';

const store = createStore((state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      // Object.assign() returns first param and copies the others params on to it
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return Object.assign({}, state, {
        cards: state.cards ? state.cards.concat([newCard]) : [newCard]
      });
    
    default:
      return state || {}
  } 
});

// subscribe to actions
store.subscribe(() => {
  console.log(store.getState());
});


// dispatch actions
store.dispatch({
  type: 'ADD_CARD',
  data: {
    front: 'front',
    back: 'back'
  }
});

// should console log state!
```

## Combining Reducers

All reducers will be run through. So we need to safeguard against state changes.

> src/app.js

```javascript
// creating a Redux store

import {createStore, combineReducers } from 'redux';

const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  } 
};

const store = createStore(combineReducers({ cards }));

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch({
  type: 'ADD_CARD',
  data: {
    front: 'front',
    back: 'back'
  }
});
```

## Builing a Pure Components

> Start the Sidebar

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  } 
};

const store = createStore(combineReducers({ cards }));

const App = (props) => {
  return (
    <div className='app'>
      { props.children } // render App children from the definition below
    </div>
  );
};

const Sidebar = React.createClass({
  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}> {deck.name} </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' />} // this expression will stop at the first one if its false
      </div>
    )
  }
});

ReactDOM.render((<App>
  <Sidebar decks={[{ name: 'Deck 1' }]} addingDeck={ false } />
</App>), document.getElementById('root'));
```

## Action Creators

> src/app.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const addDeck = name => ({ type: 'ADD_DECK', data: name });
const showAddDeck = () => ({ type: 'SHOW_ADD_DECK' });
const hideAddDeck = () => ({ type: 'HIDE_ADD_DECK' });

const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  } 
};

const decks = (state, action) => {
  switch(action.type) {
    case 'ADD_DECK':
      let newDeck = { name: action.data, id: +new Date };
      return state.concat([newDeck]);
    default:
      return state || [];
  }
};

const addingDeck = (state, action) => {
  switch (action.type) {
    case 'SHOW_ADD_DECK':
      return true;
    case 'HIDE_ADD_DECK':
      return false;
    default:
      return !!state;
  }
};

const store = createStore(combineReducers({ cards, decks, addingDeck }));

const App = (props) => {
  return (
    <div className='app'>
      { props.children }
    </div>
  );
};

const Sidebar = React.createClass({
  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}> {deck.name} </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' />}
      </div>
    )
  }
});

function run () {
  let state = store.getState();
  console.log(state);
  ReactDOM.render((<App>
    <Sidebar decks={ state.decks } addingDeck={ state.addingDeck } />
  </App>), document.getElementById('root'));
}

run();

store.subscribe(run);

// store.dispatch(showAddDeck());
// window.hide = store.dispatch(hideAddDeck());
// store.dispatch(addDeck(new Date().toString()));
```

## Use Action Creators

> src/app.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';

const addDeck = name => ({ type: 'ADD_DECK', data: name });
const showAddDeck = () => ({ type: 'SHOW_ADD_DECK' });
const hideAddDeck = () => ({ type: 'HIDE_ADD_DECK' });

const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  } 
};

const decks = (state, action) => {
  switch(action.type) {
    case 'ADD_DECK':
      let newDeck = { name: action.data, id: +new Date };
      return state.concat([newDeck]);
    default:
      return state || [];
  }
};

const addingDeck = (state, action) => {
  switch (action.type) {
    case 'SHOW_ADD_DECK':
      return true;
    case 'HIDE_ADD_DECK':
      return false;
    default:
      return !!state;
  }
};

const store = createStore(combineReducers({ cards, decks, addingDeck }));

const App = (props) => {
  return (
    <div className='app'>
      { props.children }
    </div>
  );
};

const Sidebar = React.createClass({

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode( this.refs.add );
    if (el) el.focus();
  },

  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <button onClick={ this.props.showAddDeck }>Add Deck</button>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}> {deck.name} </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' onKeyPress={ this.createDeck } />}
      </div>
    )
  },

  createDeck(evt) {
    if (evt.which !== 13) return;

    var name = ReactDOM.findDOMNode(this.refs.add).value;
    this.props.addDeck(name);
    this.props.hideAddDeck();
  }
});

function run () {
  let state = store.getState();
  console.log(state);
  ReactDOM.render((<App>
    <Sidebar 
      decks={ state.decks } 
      addingDeck={ state.addingDeck }
      addDeck={ name => store.dispatch(addDeck(name)) }
      showAddDeck={ () => store.dispatch(showAddDeck()) }
      hideAddDeck={ () => store.dispatch(hideAddDeck()) }
      />
  </App>), document.getElementById('root'));
}

run();

store.subscribe(run);
```
## Refactor for Scalability

> index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flashcard App</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.js"></script>
</body>
</html>
```

> scr/app.js -> src/index.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { addDeck, showAddDeck, hideAddDeck } from './actions';
import * as reducers from './reducers';
import App from './components/App';
import Sidebar from './components/Siderbar';

const store = createStore(combineReducers(reducers));


function run () {
  let state = store.getState();
  console.log(state);
  ReactDOM.render((<App>
    <Sidebar 
      decks={ state.decks } 
      addingDeck={ state.addingDeck }
      addDeck={ name => store.dispatch(addDeck(name)) }
      showAddDeck={ () => store.dispatch(showAddDeck()) }
      hideAddDeck={ () => store.dispatch(hideAddDeck()) }
      />
  </App>), document.getElementById('root'));
}

run();

store.subscribe(run);
```

> src/components/App.js

```javascript
import React from 'react';

const App = (props) => {
  return (
    <div className='app'>
      { props.children }
    </div>
  );
};

export default App;
```

> src/components/Sidebar.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const Sidebar = React.createClass({

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this.refs.add);
    if (el) el.focus();
  },

  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <button onClick={ this.props.showAddDeck }>Add Deck</button>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}> {deck.name} </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' onKeyPress={ this.createDeck } />}
      </div>
    )
  },

  createDeck(evt) {
    if (evt.which !== 13) return;

    var name = ReactDOM.findDOMNode(this.refs.add).value;
    this.props.addDeck(name);
    this.props.hideAddDeck();
  }
});

export default Sidebar;
```

> actions.js

```javascript
export const addDeck = name => ({ type: 'ADD_DECK', data: name });
export const showAddDeck = () => ({ type: 'SHOW_ADD_DECK' });
export const hideAddDeck = () => ({ type: 'HIDE_ADD_DECK' });
```

> src/components/reducers.js

```javascript
export const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  }
};

export const decks = (state, action) => {
  switch (action.type) {
    case 'ADD_DECK':
      let newDeck = { name: action.data, id: +new Date };
      return state.concat([newDeck]);
    default:
      return state || [];
  }
};

export const addingDeck = (state, action) => {
  switch (action.type) {
    case 'SHOW_ADD_DECK':
      return true;
    case 'HIDE_ADD_DECK':
      return false;
    default:
      return !!state;
  }
};
```

## Using the 'react-redux' Package

Give all your components access to your store without having a global store.

- `npm i -S react-redux`

> src/components/index.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reducers from './reducers';
import App from './components/App';
import Sidebar from './components/Siderbar';
import { Provider } from 'react-redux';

const store = createStore(combineReducers(reducers));

function run () {
  let state = store.getState();
  console.log(state);
  ReactDOM.render((
    <Provider store={store}>
      <App>
        <Sidebar />
      </App>
    </Provider>
  ), document.getElementById('root'));
}

run();

store.subscribe(run);
```

> src/components/Sidebar.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { addDeck, showAddDeck, hideAddDeck } from '../actions';

const mapStateToProps = ({ decks, addingDeck }) => ({ decks, addingDeck});

const mapDispatchToProps = dispatch => ({
  addDeck: name => dispatch(addDeck(name)),
  showAddDeck: () => dispatch(showAddDeck()),
  hideAddDeck: () => dispatch(hideAddDeck())
});

const Sidebar = React.createClass({

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this.refs.add);
    if (el) el.focus();
  },

  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <button onClick={ this.props.showAddDeck }>Add Deck</button>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}> {deck.name} </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' onKeyPress={ this.createDeck } />}
      </div>
    )
  },

  createDeck(evt) {
    if (evt.which !== 13) return;

    var name = ReactDOM.findDOMNode(this.refs.add).value;
    this.props.addDeck(name);
    this.props.hideAddDeck();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
```

## Add a Router

- `npm i -S react-router react-router-redux`

> src/index.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reducers from './reducers';
import App from './components/App';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers));
const history = syncHistoryWithStore(browserHistory, store);
const routes = (<Route path='/' component={App} />);

function run () {
  let state = store.getState();
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
```

> src/components/App.js

```javascript
import React from 'react';
import Sidebar from './Siderbar';

const App = (props) => {
  return (
    <div className='app'>
      <Sidebar />
      { props.children }
    </div>
  );
};

export default App;
```

## Create Nested Routes

- `touch src/components/VisibleCards.js`

> src/index.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reducers from './reducers';
import App from './components/App';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import VisibleCards from './components/VisibleCards';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers));
const history = syncHistoryWithStore(browserHistory, store);
const routes = (
  <Route path='/' component={App}>
    <Route path='/deck/:deckId' component={VisibleCards}></Route>
  </Route>
);

function run () {
  let state = store.getState();
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
```

> src/components/VisibleCards.js

```javascript
import React from 'react';

const Cards = () => {
  return (<div>Deck will display here </div>);
};

export default Cards;
```

> src/components/App.js

```javascript
import React from 'react';
import Sidebar from './Siderbar';
import { connect } from 'react-redux';

const mapStateToProps = (props, { params: { deckId } }) => ({ deckId });

const App = ({ deckId, children }) => {
  return (
    <div className='app'>
      <Sidebar />
      <h1>Deck {deckId}</h1>
      { children }
    </div>
  );
};

export default connect(mapStateToProps)(App);
```

> src/components/Sidebar.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { addDeck, showAddDeck, hideAddDeck } from '../actions';
import { Link } from 'react-router';

const mapStateToProps = ({ decks, addingDeck }) => ({ decks, addingDeck});

const mapDispatchToProps = dispatch => ({
  addDeck: name => dispatch(addDeck(name)),
  showAddDeck: () => dispatch(showAddDeck()),
  hideAddDeck: () => dispatch(hideAddDeck())
});

const Sidebar = React.createClass({

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this.refs.add);
    if (el) el.focus();
  },

  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <button onClick={ this.props.showAddDeck }>Add Deck</button>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}>
              <Link to={`/deck/${deck.id}`}>{deck.name}</Link>
            </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' onKeyPress={ this.createDeck } />}
      </div>
    )
  },

  createDeck(evt) {
    if (evt.which !== 13) return;

    var name = ReactDOM.findDOMNode(this.refs.add).value;
    this.props.addDeck(name);
    this.props.hideAddDeck();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
```

## Add 'localStorage' Support

- `touch src/localStorage.js`

> localStorage.js

```javascript
export const get = () => JSON.parse(localStorage.getItem('state')) || undefined;
export const set = (state, props) => {
  let toSave = {};

  props.map(p => toSave[p] = state[p]);
  localStorage.setItem('state', JSON.stringify(toSave));
}
```

> index.js

```javascript
import {createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import * as reducers from './reducers';
import App from './components/App';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import VisibleCards from './components/VisibleCards';

import * as localStore from './localStorage';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers), localStore.get());
const history = syncHistoryWithStore(browserHistory, store);
const routes = (
  <Route path='/' component={App}>
    <Route path='/deck/:deckId' component={VisibleCards}></Route>
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
```
 
 ## Create the Toolbar

- `touch src/components/Toolbar.js`

> src/components/Toolbar.js
 
```javascript
import React from 'react';
import { showAddDeck } from '../actions';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  showAddDeck: () => dispatch(showAddDeck())
});

const Toolbar = ({ showAddDeck, deckId }) => {

  let deckTools = deckId ? (
    <div>
      <Link className='btn' to={`/deck/${deckId}/new`}>+ New Card</Link>
      <Link className='btn' to={`/deck/${deckId}/study`}>Study Deck</Link>
    </div>
  ) : null;

  return (
    <div className='toolbar'>
      <div>
        <button onClick={ showAddDeck } >+ New Deck</button>
      </div>
      {deckTools}
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Toolbar);
```

> src/components/App.js

```javascript
import React from 'react';
import Sidebar from './Siderbar';
import { connect } from 'react-redux';
import Toolbar from './Toolbar';

const mapStateToProps = (props, { params: { deckId } }) => ({ deckId });

const App = ({ deckId, children }) => {
  return (
    <div className='app'>
      <Toolbar deckId={deckId}/>
      <Sidebar />
      <h1>Deck {deckId}</h1>
      { children }
    </div>
  );
};

export default connect(mapStateToProps)(App);
```

> src/components/Sidebar.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { addDeck, showAddDeck, hideAddDeck } from '../actions';
import { Link } from 'react-router';

const mapStateToProps = ({ decks, addingDeck }) => ({ decks, addingDeck});

const mapDispatchToProps = dispatch => ({
  addDeck: name => dispatch(addDeck(name)),
  showAddDeck: () => dispatch(showAddDeck()),
  hideAddDeck: () => dispatch(hideAddDeck())
});

const Sidebar = React.createClass({

  componentDidUpdate() {
    var el = ReactDOM.findDOMNode(this.refs.add);
    if (el) el.focus();
  },

  render() {
    let props = this.props;

    return (
      <div className='sidebar'>
        <h2>All Decks</h2>
        <ul>
          {props.decks.map((deck, i) =>
            <li key={i}>
              <Link to={`/deck/${deck.id}`}>{deck.name}</Link>
            </li>
          ) }
        </ul>
        { props.addingDeck && <input ref='add' onKeyPress={ this.createDeck } />}
      </div>
    )
  },

  createDeck(evt) {
    if (evt.which !== 13) return;

    var name = ReactDOM.findDOMNode(this.refs.add).value;
    this.props.addDeck(name);
    this.props.hideAddDeck();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
```

## Create the New Card Modal

- `touch src/components/CardModal.js`
- `touch src/components/NewCardModal.js`

> src/components/CardModal.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';

const CardModal = React.createClass({

  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.front).focus();
  },

  render() {
    let { card, onDelete } = this.props;

    return (
      <div className='modal'>
        <h1> { onDelete ? 'Edit' : 'New' } </h1>
        <label> Card Front: </label>
        <textarea ref='front' defaultValue={ card.front } />
        <label> Card Back: </label>
        <textarea ref='back' defaultValue={ card.back } />
        <p>
          <button onClick={this.onSave}> Save Card </button>
          <Link className='btn' to={`/deck/${card.deckId}`}> Cancel </Link>
          { onDelete ?
            <button onClick={this.onDelete} className='delete'> Delete Card </button> :
            null  
          }
        </p>
      </div>
    );
  },

  onSave(evt) {
    let front = ReactDOM.findDOMNode(this.refs.front);
    let back = ReactDOM.findDOMNode(this.refs.back);

    this.props.onSave(Object.assign({}, this.props.card, {
      front: front.value,
      back: back.value
    }));

    browserHistory.push(`/deck/${this.props.card.deckId}`);
  },

  onDelete(e) {
    this.props.onDelete(this.props.card.id);
    browserHistory.push(`/deck/${this.props.card.deckId}`);
  }
});

export default CardModal;
```

> src/components/NewCardModal.js

```javascript
import CardModal from './CardModal';
import { connect } from 'react-redux';
import { addCard } from '../actions';

const mapStateToProps = (props, { params: { deckId } }) => ({
  card: { deckId }
});

const mapDispatchToProps = dispatch => ({
  onSave: card => dispatch(addCard(card))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
```

> src/actions.js

```javascript
export const addDeck = name => ({ type: 'ADD_DECK', data: name });
export const showAddDeck = () => ({ type: 'SHOW_ADD_DECK' });
export const hideAddDeck = () => ({ type: 'HIDE_ADD_DECK' });

export const addCard = card => ({ type: 'ADD_CARD', data: card });
```

> src/reducers.js

```javascript
export const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    default:
      return state || [];
  }
};
```

> src/index.js

```javascript
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

import * as localStore from './localStorage';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers), localStore.get());
const history = syncHistoryWithStore(browserHistory, store);
const routes = (
  <Route path='/' component={App}>
    <Route path='/deck/:deckId' component={VisibleCards}>
      <Route path='/deck/:deckId/new' component={NewCardModal}></Route>
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
```

> src/components/VisibleCards.js

```javascript
import React from 'react';

const Cards = ({ children }) => {
  return (<div>Deck will display here {children} </div>);
};

export default Cards;
```

## Display Deck of Cards

- `touch src/components/Card.js`

> src/components/VisibleCards.js

```javascript
import React from 'react';
import Card from './Card';
import { connect } from 'react-redux';

const mapStateToProps = ({ cards }, { params: { deckId } }) => ({
  cards: cards.filter(c => c.deckId === deckId)
});

const Cards = ({ cards, children }) => {
  return (
    <div className='main'>
      {cards.map(card => <Card card={card} key={card.id} />)}
      {children} 
    </div>
  );
};

export default connect(mapStateToProps)(Cards);
```

> src/components/Card.js

```javascript
import React from 'react';
import { Link } from 'react-router';

const Card = ({ card }) => {
  return (
    <div className='card'>
      <div>
        <p> {card.front} </p>
        <Link className='btn' to={`/deck/${card.deckId}/edit/${card.id}`}> Edit </Link>
      </div>
    </div>
  )
}

export default Card;
```

## Create the Edit Card Modal

- `touch src/components/EditCardModal.js`

> src/components/EditCardModal.js

```javascript
import { updateCard, deleteCard } from '../actions';
import { connect } from 'react-redux';
import CardModal from './CardModal';

const mapStateToProps = ({ cards }, { params: { cardId }}) => ({
  card: cards.filter(card => card.id === parseInt(cardId))[0]
});

const mapDispatchToProps = dispatch => ({
  onSave: card => dispatch(updateCard(card)),
  onDelete: cardId => dispatch(deleteCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
```

> src/index.js

```javascript
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

import * as localStore from './localStorage';

reducers.routing = routerReducer;

const store = createStore(combineReducers(reducers), localStore.get());
const history = syncHistoryWithStore(browserHistory, store);
const routes = (
  <Route path='/' component={App}>
    <Route path='/deck/:deckId' component={VisibleCards}>
      <Route path='/deck/:deckId/new' component={NewCardModal}></Route>
      <Route path='/deck/:deckId/edit/:cardId' component={EditCardModal}></Route>
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
```

> src/components/actions.js

```javascript
export const addDeck = name => ({ type: 'ADD_DECK', data: name });
export const showAddDeck = () => ({ type: 'SHOW_ADD_DECK' });
export const hideAddDeck = () => ({ type: 'HIDE_ADD_DECK' });

export const addCard = card => ({ type: 'ADD_CARD', data: card });
export const updateCard = card => ({ type: 'UPDATE_CARD', data: card });
export const deleteCard = cardId => ({ type: 'DELETE_CARD', data: cardId });
```

> src/components/reducers.js

```javascript
export const cards = (state, action) => {
  switch (action.type) {
    case 'ADD_CARD':
      let newCard = Object.assign({}, action.data, {
        score: 1,
        id: +new Date
      });

      return state.concat([newCard]);

    case 'UPDATE_CARD':
      let cardUpdate = action.data;
      return state.map(card => (
        (card.id !== cardUpdate.id) ?
        card:
        Object.assign({}, card, cardUpdate)
      ));

    case 'DELETE_CARD':
      return state.filter(c => c.id !== action.data)

    default:
      return state || [];
  }
};

export const decks = (state, action) => {
  switch (action.type) {
    case 'ADD_DECK':
      let newDeck = { name: action.data, id: +new Date };
      return state.concat([newDeck]);
    default:
      return state || [];
  }
};

export const addingDeck = (state, action) => {
  switch (action.type) {
    case 'SHOW_ADD_DECK':
      return true;
    case 'HIDE_ADD_DECK':
      return false;
    default:
      return !!state;
  }
};
```

## Creata a Study Interface

- `touch src/components/StudyModal.js`