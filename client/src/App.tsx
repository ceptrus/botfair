import * as React from "react";
const logo = require('./logo.svg');
// import logo from './logo.svg';
import './App.css';

export class App extends React.Component<any, any> {
  public render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

