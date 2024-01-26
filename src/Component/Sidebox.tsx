import React, { useContext, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Contexts/Context';
import RightSideBar from './RightSideBar';

function Sidebox() {
    // 取得jwt中的uid
    const jwt = localStorage.getItem('user') as any
    // 麻煩的拿到裡面的uid
    const token = JSON.parse(jwt).token
    const [header, payload] = token.slice(4,).split('.');
    const decodedPayload = JSON.parse(atob(payload));
  
  
    const user_uuid: string = decodedPayload.uid
    console.log(decodedPayload)

    const [event, setEvent] = useState<String[]>([])
    const navigate = useNavigate();
  const { currentUser,setCurrentUser,ws } = useContext(Context)!;
  const noDot={
    listStyle: "none"
  }
  
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
    
      // <div className='pt-6 w-64 bg-lightblue h-full'>
      //   <li style={noDot} className='w-full font-semibold text-lg flex-col p-2 mt-4'>
      //     <button className='flex ChenLin w-full rounded-lg border-none hover:bg-blue-100 my-1 p-2' onClick={()=>{navigate(`/personal/${currentUser?.id}`)}}>
      //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-4 me-6">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      //       </svg>{currentUser?.username}</button>
      //     <button className='flex News w-full rounded-lg border-none hover:bg-blue-100 my-1 p-2' onClick={()=>{navigate("/")}}>
      //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-4 me-6">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      //       </svg>News Feed</button>
      //     <button className='flex Friends w-full rounded-lg border-none hover:bg-blue-100 my-1 p-2' onClick={()=>{navigate(`/personal/${currentUser?.id}/friend`)}}>
      //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-4 me-6">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      //       </svg>Friends</button>
      //     <button className='flex Photos w-full rounded-lg border-none hover:bg-blue-100 my-1 p-2'>
      //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-4 me-6">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      //       </svg>Photos</button>
      //   </li>
      
      // <div className='my-2 mx-5 mt-4 pt-4 flex font-bold'>Events</div>
      // <div className="my-2 mx-5 border border-5 border-gray-300"></div>
      // <div className='my-2 text flex mx-5'>軒宏好帥</div>
      // {
      //     event.length > 0 && event.map((each,index) =>{
      //       return  <div key={index} className='my-2 text flex mx-5'>{each}</div>
      //     })
      // }






      // </div>
      <>
            
      <aside id="logo-sidebar" className="fixed top-16 left-0 z-40 w-64 h-screen pt-4 hidden lg:block bg-lightblue border-r border-gray-200  dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
          <div className="menu h-full px-3 pb-4 overflow-y-auto bg-lightblue dark:bg-gray-800">
              <ul className="space-y-2 font-medium">
                  <li>
                      <button className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate(`/personal/${currentUser?.id}`)}}>
                          <svg className="w-[24px] h-[23px] text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          </svg>
                          <span className="ms-2 text-base">{currentUser?.username}</span>
                      </button>
                  </li>
                  <li>
                      <button className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate("/")}}>
                      <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap text-base">News Feed</span>
                      </button>
                  </li>
                  <li>
                      <button className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group" onClick={()=>{navigate(`/personal/${currentUser?.id}/friend`)}}>
                      <svg className="flex-shrink-0 w-5 h-5 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap text-base">Friends</span>
                      </button>
                  </li>
                  <li>
                      <button className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-sky-100 dark:hover:bg-gray-700 group">
                      <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                          <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap text-base">Photos</span>
                      </button>
                  </li>
              </ul>

              <div className='mx-2 mt-14 flex font-bold'>Events</div>
              <div className="mx-2 mt-2 border border-5 border-gray-300"></div>
              <div className='mx-2 mt-2 text flex'>軒宏好帥</div>
              {
                  event.length > 0 && event.map((each,index) =>{
                      return  <div key={index} className='mx-2 mt-2 text flex'>{each}</div>
                  })
              }

          </div>
      </aside>
      <div className='w-64 h-screen fixed top-16 right-0 hidden lg:block'>
          <RightSideBar/>
      </div>

  </>
    
        
      

    
  )
}

export default Sidebox