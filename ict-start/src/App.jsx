import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Login from './component/Login';

function Home() {
  return <h2>홈페이지</h2>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
