import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function getApp() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

function HelloWorld() {
  return <h1>Hello World</h1>;
}

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={getApp()} />
            <Route path="/hello" element={<HelloWorld />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
