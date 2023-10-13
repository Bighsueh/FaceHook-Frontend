import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Component/Navbar'
import Sidebox from './Component/Sidebox'
import Chat from './Component/Chat'
import Home from './Page/Home';
import Profile from './Page/Profile';
import ChatRoom from './Component/ChatRoom';


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
        >
          Learn React
        </a>
      </header> */}
      {/* <ContextProvider> */}
        <Navbar />
        <Sidebox />
        <ChatRoom />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      {/* </ContextProvider> */}
    </div>
  );
}

export default App;
