import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext } from "react";
import Sidebox from './Component/Sidebox'
import Chat from './Component/Chat'
import Home from './Page/Home';
import Profile from './Page/Profile';
import Login from './Page/Login';
import Layout1 from './Page/Layout/layout1';
import Layout2 from './Page/Layout/layout2';
import { ContextProvider, Context } from './Contexts/Context';
import Search from './Page/Search';
import Personal from './Page/Personal';
import Friend from './Page/Friend';


function App() {
 
  const { currentUser, setCurrentUser } = useContext(Context)!;

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
    
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            {(currentUser !== null && currentUser !== '') ? (
              <Route path="/" element={<Layout1 />} >
                <Route index element={<Home />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/search" element={<Search/>} />
              </Route>
              ):(
              <Route path="/" element={<Layout2 />}>
                <Route index element={<Login />} />
              </Route>
            )}
            {(currentUser !== null && currentUser !== '') ? (
              <Route path="/personal/:userId" element={<Layout2 />}>
                <Route path="/personal/:userId" element={<Personal/>} />
                <Route path="/personal/:userId/friend" element={<Friend/>} />
              </Route>
            ):(
              <Route path="/home" element={<Layout2 />}>
                <Route index element={<Login />} />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;
