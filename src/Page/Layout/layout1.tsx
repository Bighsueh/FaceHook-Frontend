import React, { useState,useContext,useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../../Component/Navbar';
import Sidebox from '../../Component/Sidebox';
import RightSideBar from '../../Component/RightSideBar';
import ChatRoom from '../../Component/ChatRoom';
import { ChatContextProvider } from '../../Contexts/ChatContext';

import AuthService from '../../API/Auth'
import UserService from '../../API/User'
import { Context } from '../../Contexts/Context';
import { io } from "socket.io-client";



function Layout1() {
  
  const navigate = useNavigate();

  const { currentUser,setCurrentUser,ws, setWs } = useContext(Context)!;
  const [keyword, setKeyword] = useState('');
  const [invitation,setInvitation] = useState<any[]>([]);
  const [reloadInvitations, setReloadInvitations] = useState(false);


  useEffect(() => {
    // 把jwt做為參數傳到後端讓socket記錄下來 紀好之後發現好像沒啥用
    // 放到useEffect代表只會連線一次 
    const token = localStorage.getItem('user') as string
    setWs(io('http://localhost:8080', {
      query: {
        token: JSON.parse(token).token,  // Include your JWT token here
      },
    }))

    //websocket disconnect
    return () => {
      console.log('disconnect')
      ws?.disconnect();
    };
  }, [])

  useEffect(() => {
    console.log(ws)
    // 連成功後就開始監聽
    if (ws) {
      console.log('connect success')
      ws.on("onFriendUpdate",() =>{
        UserService.getFriendInvitations(currentUser.id)
    .then((data)=>{
      setInvitation(data.data)
    })
    .catch((e)=>{
      console.log(e)
    })
      })
    }

  }, [ws])

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser('')
    navigate("/home")
    window.location.reload();
  };

  const handleSearchClick = () => {
    if(keyword.trim() !== ""){
      navigate(`/search?q=${keyword}`);
      window.location.reload();
    } else{
      window.alert("請輸入內容")
    }
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
      ws?.emit("onFriendInvite", data.data)
      console.log('成功成為好友')
      setReloadInvitations(true);
    })
    .catch((e) => {
        console.log(e);
    });
  };

  const handleDelFriendInvitation = (friendId:any) => {
    UserService.removeFriendInvite(friendId)
    .then((data) => {
      ws?.emit("onFriendInvite")
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

    // 取得jwt中的uid
    const jwt = localStorage.getItem('user') as any
    // 麻煩的拿到裡面的uid
    const token = JSON.parse(jwt).token
    const [header, payload] = token.slice(4,).split('.');
    const decodedPayload = JSON.parse(atob(payload));


    const user_uuid: string = decodedPayload.uid
    console.log(decodedPayload)

    const [event, setEvent] = useState<String[]>([])

    useEffect(() => {
        // 連成功後就開始監聽
        if (ws) {
          console.log('connect success')
          ws.on("onEventReceived", (data) => {
            if (data.post.user_id.uid !== user_uuid) {
              const name = data.post.user_id.username
              setEvent(prevState => [...prevState, `${name} 發布了一則貼文`]);
              console.log(data)
            }
          })
          ws.on("onLikeReceived", (data) => {
            console.log(data)
            if (data.triggleBy === user_uuid) {
              const name = data.name
              setEvent(prevState => [...prevState, `${name} 說你的貼文讚`]);
            }
          })
          ws.on("onCommentReceived", (data) => {
            console.log(data)
            if (data.triggleBy === user_uuid) {
              const name = data.name
              setEvent(prevState => [...prevState, `${name} 在你的貼文下留言`]);
            }
          })
        }
    
      }, [ws])
  

  return (
    <ChatContextProvider>
        <div className="drawer ">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
            
            {/* Navbar */}
            <div className="drawer-content flex flex-col">
                <div className="fixed top-0 z-50 w-full navbar bg-mistblue">
                    
                    <div className="flex-none text-white lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div> 

                    <Link to='/'>
                        <div className="flex-1 px-2 mx-2 font-bold text-2xl text-white">FaceHook</div>
                    </Link>

                    {/* Search box */}
                    <div className="relative me-2 mx-auto text-gray-600 hidden lg:block">
                        <input className="border-1 border-gray-200 bg-white h-10 px-5 pr-16 rounded-xl text-sm focus:outline-none" type="search" name="search" placeholder="Search" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyUp={handleEnterKey}/>
                        <button type="submit" className="absolute right-0 top-0 mt-3 mr-4" onClick={handleSearchClick}>
                            <svg className="w-4 h-4 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </button>
                    </div>                    

                    <div className="ml-auto lg:flex-none lg:ml-0">
                        <ul className="flex">
                            <li className='mx-2'>
                                
                                <div className="dropdown dropdown-bottom dropdown-end ml-2">
                                    <div className="indicator">
                                    {/* <span className="indicator-item me-3.5 mt-1.5 badge badge-xs py-2 bg-blue-700 border-blue-700 text-white">1</span> */}
                                    <button tabIndex={0} className="text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-8 h-8 me-1 place-self-center">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                    </button>
                                    </div>           
                                    
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu mt-2 p-2 shadow bg-white rounded-box w-72">
                                    {invitation !== null && invitation.map((data)=>{
                                        return(
                                        <Link to="#" className="flex px-4 py-3">
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
                                        </Link>
                                        )
                                    })}
                                    {invitation.length === 0 && 
                                        <div className='grid grid-cols-3 h-12 w-full place-items-center'><p className='col-start-2 text-base'>NULL</p></div>
                                    }
                                    </ul>
                                            
                                </div> 
                                
                            </li>
                            <li className='mx-2'>
                                
                                <div className="dropdown dropdown-bottom dropdown-end me-2">
                                    <button tabIndex={0} className="text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-8 h-8 place-self-center">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    </button>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu mt-2 p-2 shadow bg-base-100 rounded-box w-52">
                                      <li><button onClick={()=>{navigate(`/personal/${currentUser?.id}`)}}>個人檔案</button></li>
                                      <li><button onClick={handleLogout}>登出</button></li>
                                    </ul>
                                </div> 
                                
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Page content here */}
                {/* <div className='absolute top-16 left-5 right-5 md:left-16 md:right-16 lg:left-64 lg:right-64'> */}
                <div>
                    <Outlet/>
                </div>
            </div> 

            {/* Sidebar */}
            <div className="drawer-side lg:hidden">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label> 
                <ul className="p-4 mt-10 pt-12 w-64 space-y-2 min-h-full bg-lightblue font-medium">
                    <li>
                        {/* Search box */}
                        <div className="relative m-0 p-0 mb-5 mt-1 text-gray-600 hover:bg-transparent focus:bg-transparent active:bg-transparent">
                            <input className="border-1 border-gray-200 bg-white h-10 px-5 pr-8 rounded-xl text-sm focus:outline-none active:bg-transparent" type="search" name="search" placeholder="Search" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyUp={handleEnterKey}/>
                            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 hover:bg-transparent focus:bg-transparent active:bg-transparent" onClick={handleSearchClick}>
                                <svg className="w-4 h-4 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </button>
                        </div>
                    </li>
                    <li>
                        <button className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 active:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate(`/personal/${currentUser?.id}`)}}>
                            <svg className="w-[24px] h-[23px] text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            </svg>
                            <span className="ms-4 text-base">{currentUser?.username}</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate("/")}}>
                        <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        <span className="ms-4 whitespace-nowrap text-base">News Feed</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate(`/personal/${currentUser?.id}/friend`)}}>
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                        </svg>
                        <span className="ms-4 whitespace-nowrap text-base">Friends</span>
                        </button>
                    </li>
                    <li>
                        <button className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group">
                        <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                        </svg>
                        <span className="ms-4 whitespace-nowrap text-base">Photos</span>
                        </button>
                    </li>
                    {/* Event */}
                    <li>
                        <div className='mx-2 mt-14 flex font-bold'>Events</div>
                        <div className="mx-2 mt-2 border border-5 border-gray-300"></div>
                        <div className='mx-2 mt-2 text flex'>軒宏好帥</div>
                        {
                            event.length > 0 && event.map((each,index) =>{
                                return  <div key={index} className='mx-2 mt-2 text flex'>{each}</div>
                            })
                        }
                        <div className='mb-10'></div>
                    </li>
                    <li>
                      <RightSideBar/>
                    </li>
                </ul>
            </div>
          

        </div>
        <ChatRoom/>
    </ChatContextProvider>
  )
}

export default Layout1