import React, { useContext } from 'react';
import AuthService from '../API/Auth'
import { Context } from '../Contexts/Context';


function Navbar() {
  
  const { currentUser,setCurrentUser } = useContext(Context)!;

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser('')
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-5 bg-mistblue">
      <div className="p-5 ml-3 text-3xl font-bold text-white text-left flex col-span-1">FaceHook</div>
      <div className='grid py-3 relative text-black text-center col-span-3'>
        {/* <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 w-64 border rounded-lg"/>
        <div className="absolute inset-y-0 right-20 flex items-center ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

        </div> */}
        <div className='grid grid-cols-10 bg-white w-2/3 h-full rounded-2xl justify-self-center px-1 pl-4'>
          <input type="text" placeholder="Search" className="justify-self-start col-span-9 w-full border-none text-lg" />
          <div className='p-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 mt-1 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

        </div>
      </div>
      <div className='m-4 ml-auto flex col-span-1'>
        <div className='h-full mx-1 grid text-white'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-9 h-9 me-1 place-self-center">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <div className='h-full mx-1 grid'>
          <div className="dropdown dropdown-bottom dropdown-end">
            <button tabIndex={0} className="m-1 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-9 h-9 me-2 place-self-center">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={handleLogout}>登出</button></li>
            </ul>
          </div>         
        </div>
        
        
      </div>

    </div>






  )
}

export default Navbar