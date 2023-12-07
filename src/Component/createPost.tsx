import React, { useState,useEffect,useContext } from 'react';
import PostService from "../API/Post";
import { Link } from 'react-router-dom';
import { Context } from '../Contexts/Context';

export default function CreatePost() {


    const [shareOption, setShareOption] = useState<string>("所有人");
    const { content,setContent,currentUser,setCurrentUser, ws } = useContext(Context)!;

    const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const handleSubmitPost = () => {
      PostService.postPost(content,shareOption)
          .then((data) => {
            ws?.emit("onEventSend", data.data)
              window.alert("新增成功");
              setContent("");
          })
          .catch((e) => {
              console.log(e);
              window.alert(e.response.data);
          });
    };

  return (
    <div>
      <div className="w-full shadow-fb rounded bg-white border border-gray-300 p-4">
        <div className="flex space-x-2">
          <img
            src="https://picsum.photos/id/1025/500"
            alt="img"
            className="h-10 w-10 rounded-full mt-1"
          />
          <Link 
            to="#" 
            className="px-3 py-3 w-full"
            onClick={() => {
              const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
              modal.showModal();
            }}
          >
            What's on your mind?
          </Link>
        </div>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
              <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>{setContent("")}}>✕</button>
              </form>
              <h3 className="font-bold text-lg ml-2">建立貼文</h3>
              <div className="divider m-0"></div>
              <div className="px-2 py-1">
                  <div className="mt-4 flex gap-4 items-center mb-5">
                      <div className="flex items-center space-x-4">                        
                          <div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                              <svg className="absolute w-14 h-14 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                          </div>
                          <div className="font-medium">
                              <div className='font-semibold ml-0.5'>{currentUser?.username}</div>
                              <div className="text-sm text-gray-500">
                                  <div className="dropdown">
                                      <label tabIndex={0} className="btn btn-xs">{shareOption}
                                          <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                          </svg>
                                      </label>
                                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                          <p className="font-black text-sm mx-3 mt-3 mb-1">貼文分享對象</p>
                                          <div className="divider m-0"></div>
                                          <li><Link to="#" onClick={() => setShareOption("所有人")}>所有人</Link></li>
                                          <li><Link to="#" onClick={() => setShareOption("朋友")}>朋友</Link></li>
                                          <li><Link to="#" onClick={() => setShareOption("只限本人")}>只限本人</Link></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <textarea 
                      id="content" 
                      style={{ minHeight:'35vh',maxHeight: '100vh' }}
                      value={content}
                      onChange={handleContent}
                      className="w-full ml-1 mt-2 resize-none px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0" 
                      placeholder="What's on your mind?"
                  ></textarea>
              </div>
              <div className='flex'>
                  <button className="inline-flex items-center justify-center w-10 h-10 mr-2  ml-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-image" viewBox="0 0 16 16">
                          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                      </svg>                    
                  </button>
                  <button className="inline-flex items-center justify-center w-10 h-10 mr-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-paperclip" viewBox="0 0 16 16">
                          <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                      </svg>                  
                  </button>
                  <form method="dialog" className='ms-auto'>
                      <button 
                        type="submit" 
                        className="ms-auto items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                        onClick={handleSubmitPost}
                      >
                          Post
                      </button>
                  </form>
              </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}