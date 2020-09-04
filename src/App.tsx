import React from 'react';
import logo from './logo.svg';
import './App.css';
import Page from './page'
import { DesignCanvas } from './Components/whiteboard/DesignCanvas';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Page/> */}
        <DesignCanvas width={50} height={50} />
        
      </header>
    </div>
  );
}

export default App;
