// import logo from './logo.svg';
import './App.css';
import React from 'react'
import SideList from './components/sidebar';
import ButtonAppBar from './components/appbar';
import MenuIcon from '@mui/icons-material/Menu';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        > */}
          {/* Learn React */}
          
          {/* <ButtonAppBar />, */}
          <SideList />
          
        {/* </a>
      </header> */}
    </div>
  );
}

export default App;
