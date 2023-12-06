import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from '../../Component/Navbar';
import Sidebox from '../../Component/Sidebox';
import RightSideBar from '../../Component/RightSideBar';
import ChatRoom from '../../Component/ChatRoom';
import { ChatContextProvider } from '../../Contexts/ChatContext';

function Layout1() {
  return (
    <ChatContextProvider>
      <div className='flex flex-col h-max bg-white'>
        <div className='fixed top-0 left-0 right-0 z-10'>
          <Navbar/>
        </div>
        <div className='flex flex-row'>
          <div className='w-1/6 h-screen fixed top-16 left-0'>
            <Sidebox/>
          </div>
          <div className='flex-grow pl-16 ml-10 pt-16 mt-5 w-3/6'>
              <div className='pl-16 ml-16'>
                <Outlet />
              </div>
          </div>
          <div className='w-1/6 h-screen fixed top-16 right-0'>
            <RightSideBar/>
          </div>
      
        </div>
      </div>
      <ChatRoom/>
    </ChatContextProvider>
  )
}




export default Layout1