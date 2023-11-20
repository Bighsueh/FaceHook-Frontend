import React, { useState,useContext,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../API/Auth'
import UserService from '../API/User'
import { Context } from '../Contexts/Context';


function Navbar() {
  
  const navigate = useNavigate();

  const { currentUser,setCurrentUser } = useContext(Context)!;
  const [keyword, setKeyword] = useState('');
  const [invitation,setInvitation] = useState<any[]>([]);
  const [reloadInvitations, setReloadInvitations] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser('')
    navigate("/home")
    window.location.reload();
  };

  const handleSearchClick = () => {
    navigate(`/search?q=${keyword}`);
    window.location.reload();
  };
  const handleEnterKey = (e:any) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(()=>{
    UserService.getFriendInvitations(currentUser.id)
    .then((data)=>{
      setInvitation(data.data)
    })
    .catch((e)=>{
      console.log(e)
    })
  },[])

  const handleAddFriend = (userId:any) => {
    UserService.confirmFriend(userId)
    .then((data) => {
      // console.log('成功成為好友')
      setReloadInvitations(true);
    })
    .catch((e) => {
        console.log(e);
    });
  };

  const handleDelFriendInvitation = (friendId:any) => {
    UserService.removeFriendInvite(friendId)
    .then((data) => {
      // console.log('成功刪除好友邀請')
      setReloadInvitations(true);
    })
    .catch((e) => {
        console.log(e);
    });
  };

  useEffect(() => {
    if (reloadInvitations) {
      UserService.getFriendInvitations(currentUser.id)
        .then((data) => {
          console.log(data.data);
          setInvitation(data.data);
          setReloadInvitations(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [reloadInvitations,invitation,currentUser.id]);
  

  return (
    <div className="grid grid-cols-5 bg-mistblue">
      <Link to='/'>
        <div className="p-5 ml-3 text-3xl font-bold text-white text-left flex col-span-1">FaceHook</div>
      </Link>
      <div className='grid py-3 relative text-black text-center col-span-3'>
        <div className='grid grid-cols-10 bg-white w-2/3 h-full rounded-2xl justify-self-center px-1 pl-4'>
          <input type="text" placeholder="Search" className="justify-self-start col-span-9 w-full border-none input-ghost text-lg" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyUp={handleEnterKey}/>
          <div className='p-2'>
            <button onClick={handleSearchClick}> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 mt-1 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            </button>
          </div>

        </div>
      </div>
      <div className='m-4 ml-auto flex col-span-1'>
        <div className='h-full mx-1 grid'>
          <div className="dropdown dropdown-bottom dropdown-end">
            <div className="indicator">
              {/* <span className="indicator-item me-3.5 mt-1.5 badge badge-xs py-2 bg-blue-700 border-blue-700 text-white">1</span> */}
              <button tabIndex={0} className="m-1 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-9 h-9 me-1 place-self-center">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
            </div>           
              
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80">
              {invitation !== null && invitation.map((data)=>{
                return(
                  <a href="#" className="flex px-4 py-3">
                    <div className="flex-shrink-0">
                      {/* <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-1.jpg" alt="img"/> */}
                      <img className="rounded-full h-11 w-11 mr-2 mt-1 " src="https://picsum.photos/id/1027/200/200"/>
                      <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z"/>
                          <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="w-full ps-3">
                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{data.user_id.username}</span> 傳送了交友邀請給你</div>
                        {/* <div className="text-xs text-blue-600 dark:text-blue-500">a few moments ago</div> */}
                        <div className='flex w-full mt-1'>
                          <div className='ml-auto'>
                            <button 
                              className='btn btn-sm me-1 bg-facebookblue text-white' 
                              onClick={()=>{handleAddFriend(data.user_id.id)}}
                            >確認</button>
                            <button className='btn btn-sm me-2' onClick={()=>{handleDelFriendInvitation(data.user_id.id)}}>刪除</button>
                          </div>
                        </div>
                    </div>
                  </a>
                )
              })}
            </ul>
                       
          </div>
        </div>



        
{/* 
        <button id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400" type="button">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
        <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
        </svg>

        <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"></div>
        </button>

        <div id="dropdownNotification" className="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
          <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
              Notifications
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <a href="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex-shrink-0">
                <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image"/>
                <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                  <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z"/>
                    <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z"/>
                  </svg>
                </div>
              </div>
              <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-white">Jese Leos</span>: "Hey, what's up? All set for the presentation?"</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">a few moments ago</div>
              </div>
            </a>
            <a href="#" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex-shrink-0">
                <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-2.jpg" alt="Joseph image"/>
                <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
                  <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                  </svg>
                </div>
              </div>
              <div className="w-full ps-3">
                  <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Joseph Mcfall</span> and <span className="font-medium text-gray-900 dark:text-white">5 others</span> started following you.</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">10 minutes ago</div>
              </div>
            </a>
          </div>
          <a href="#" className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <div className="inline-flex items-center ">
              <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg>
                View all
            </div>
          </a>
        </div> */}








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