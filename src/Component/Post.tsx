import React, { useEffect, useState } from 'react';
import PostService from "../API/Post";
import { Link } from 'react-router-dom';

interface Comment {
  created_at: string; 
  content: string;
  id: number;
  like :any;
}

const Post: React.FC = () => {

    const [postData, setPostData] = useState<any[]>([]);
    const [content, setContent] = useState<string>("");
    const [newpost, setNewpost] = useState<string>("");
    const [postId, setPostId] = useState<any>();
    const [likedPosts, setLikedPosts] = useState<{ [postId: number]: boolean }>({});
    const [likedComments, setLikedComments] = useState<{ [postId: number]: boolean }>({});
    const [visibleComments, setVisibleComments] = useState<number>(2);
    const [shareOption, setShareOption] = useState<string>("所有人");

    useEffect(() => {
        PostService.getPost()
            .then((data) => {
                console.log(data);
                setPostData(data.data);
                console.log(data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [newpost, content]);


    const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const handleSubmitPost = () => {
      PostService.postPost(content)
          .then(() => {
              window.alert("新增成功");
              setContent("");
          })
          .catch((e) => {
              console.log(e);
              window.alert(e.response.data);
          });
    };
    const handleId = (id: number) => {
      setPostId(id);
      console.log(postId);
    };
    const handleSubmitComment = () => {
        PostService.postComment(postId, content)
        .then(() => {
            window.alert("新增成功");
            setContent("")
            // setNewpost(content);
        })
        .catch((e) => {
            console.log(e);
            window.alert(e.response.data);
        });
    };
    const handleDeleteComment = (commentId: number) => {
      const confirmDelete = window.confirm("確定要刪除嗎?");
      if (confirmDelete) {
          PostService.deleteComment(commentId)
              .then(() => {
                  setNewpost("刪除評論" + commentId);
              })
              .catch((e) => {
                  console.log(e);
                  window.alert(e.response.data);
              });
      }
    };
    const handleDeletePost = () => {
        const confirmDelete = window.confirm("確定要刪除嗎?");
        if (confirmDelete) {
            PostService.deletePost(postId)
                .then(() => {
                    setNewpost(postId);
                })
                .catch((e) => {
                    console.log(e);
                    window.alert(e.response.data);
                });
        }
    };
    const handleUpdateContent = () => {
      PostService.getApost(postId)
          .then((data) => {
              console.log(data.data);
              setContent(data.data.content);
          })
          .catch((e) => {
              console.log(e);
              window.alert(e.response.data);
          });
    };
    const handleUpdatePost = () => {
        PostService.updatePost(postId, content)
            .then(() => {
                window.alert("修改成功");
                setNewpost(content);
            })
            .catch((e) => {
                console.log(e);
                window.alert(e.response.data);
            });
    };
    const handleLike = (postId: number) => {
        PostService.likePost(postId)
            .then(() => {
                setLikedPosts((prevState) => ({
                    ...prevState,
                    [postId]: true,
                }));
                setNewpost("like" + postId);
            })
            .catch((e) => {
                console.log(e);
                window.alert(e.response.data);
            });
    };
    const handleUnLike = (postId: number) => {
        PostService.unlikePost(postId)
            .then(() => {
                setLikedPosts((prevState) => ({
                    ...prevState,
                    [postId]: false,
                }));
                setNewpost("unlike" + postId);
            })
            .catch((e) => {
                console.log(e);
                window.alert(e.response.data);
            });
    };
    const handleCommentLike = (postId: number) => {
        if (likedComments[postId]) {
            PostService.unlikeComment(postId)
                .then(() => {
                    setLikedComments((prevState) => ({
                        ...prevState,
                        [postId]: false,
                    }));
                    setNewpost("unlikecomment" + postId);
                })
                .catch((e) => {
                    console.log(e);
                    window.alert(e.response.data);
                });
        } else {
            PostService.likeComment(postId)
                .then(() => {
                    setLikedComments((prevState) => ({
                        ...prevState,
                        [postId]: true,
                    }));
                    setNewpost("likecomment" + postId);
                })
                .catch((e) => {
                    console.log(e);
                    window.alert(e.response.data);
                });
        }
    };
    

    return (
        <div className='px-5'>
            <div className="py-2 bg-white rounded-t-lg">

              <div className='card border w-2/5 m-0 p-0'>
                  <div className="text-black p-4 antialiased flex m-0">
                      <img className="rounded-full h-8 w-8 mr-2 mt-1 " src="https://picsum.photos/id/1027/200/200"/>
                      <div className="rounded-lg px-4 pt-2 pb-2.5">
                          <Link to="#" 
                                className="text-sm text-gray-500 leading-relaxed" 
                                onClick={() => {
                                  const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                                  modal.showModal();
                                }}
                          >
                            What's on your mind?
                          </Link>
                      </div>
                  </div>
              </div>

              <dialog id="my_modal_1" className="modal">
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
                                      <div className='font-semibold ml-0.5'>Jese Leos</div>
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
                                className="ms-auto items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                                onClick={handleSubmitPost}
                              >
                                  Post
                              </button>
                          </form>
                      </div>
                  </div>
              </dialog>

            </div>

            {postData !== null && postData.map((data)=>{
            
                const createdAt = new Date(data.created_at).toLocaleString('zh-TW', { year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',hour12: true });
                const visibleCommentList = data.comments.slice(0, visibleComments) as Comment[];
                const isLiked = likedPosts[data.id] || false;

                return(
                    <div key={data.id} className="mt-3 p-2 w-2/5 bg-white border border-gray-200 rounded-lg shadow">
                        <div className="flex justify-between px-4 pt-2">
                            
                            <div className="mt-4 flex gap-4 items-center mb-5">
                                <div className="flex items-center space-x-4">                        
                                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    </div>

                                    <div className="font-medium">
                                        <div className='font-semibold'>Jese Leos</div>
                                        <div className="text-sm text-gray-500">{createdAt}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown dropdown-bottom dropdown-end flex">
                                <button tabIndex={0} className='items-center ml-2 mb-3' onMouseOver={() => setPostId(data.id)}>
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                    </svg>
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <Link 
                                            to="#"
                                            onMouseOver={() => handleId(data.id)} 
                                            onClick={() => {
                                                handleUpdateContent()
                                                const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
                                                modal.showModal();
                                            }}       
                                        >編輯貼文</Link>
                                    </li>
                                    <li><Link to="#" onClick={handleDeletePost}>刪除貼文</Link></li>
                                </ul>
                                <dialog id="my_modal_2" className="modal">
                                    <div className="modal-box">
                                        <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                        </form>
                                        <h3 className="font-bold text-lg ml-2">編輯貼文</h3>
                                        <div className="divider m-0"></div>
                                        <div className="px-2 py-1">
                                            <div className="mt-4 flex gap-4 items-center mb-5">
                                                <div className="flex items-center space-x-4">                        
                                                    <div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                                                        <svg className="absolute w-14 h-14 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                                    </div>
                                                    <div className="font-medium">
                                                        <div className='font-semibold ml-0.5'>Jese Leos</div>
                                                        <div className="text-sm text-gray-500">

                                                            <details className="dropdown dropdown-right">
                                                                <summary className="btn btn-xs">{shareOption}
                                                                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                                    </svg>
                                                                </summary>
                                                                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                                                    <li><Link to="#" onClick={() => setShareOption("所有人")}>所有人</Link></li>
                                                                    <li><Link to="#" onClick={() => setShareOption("朋友")}>朋友</Link></li>
                                                                    <li><Link to="#" onClick={() => setShareOption("只限本人")}>只限本人</Link></li>
                                                                </ul>
                                                            </details>

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
                                            className="ms-auto items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                                            onClick={handleUpdatePost}
                                            >
                                                Save
                                            </button>
                                            </form>
                                        </div>                                
                                    </div>
                                </dialog>
                            </div>
                        </div>

                        <div className="flex flex-col pb-5 ">
                            <div className="p-5 ">
                                <p
                                    className='text-gray-700 '
                                    dangerouslySetInnerHTML={{
                                        __html: data.content.replace(/\n/g, '<br>')
                                    }}
                                ></p>                       
                            </div>
                            <div className="flex justify-normal ml-3 mt-5">
                                    {isLiked ? (
                                        <Link to="#" onClick={() => handleUnLike(data.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#2563EB" className="bi bi-hand-thumbs-up-fill ml-2" viewBox="0 0 16 16">
                                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                            </svg>
                                        </Link>
                                    ) : (
                                        <Link to="#" onClick={() => handleLike(data.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#374151" className="bi bi-hand-thumbs-up ml-2" viewBox="0 0 16 16">
                                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                            </svg>
                                        </Link>
                                    )}
                                <p className='text-sm px-3'>{data.like.length} Likes</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#374151" className="bi bi-chat-dots" viewBox="0 0 16 16">
                                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                                </svg>
                                <p className='text-sm px-3'>{data.comments.length} Comments</p>
                                
                            </div>                    
                            
                            <div className="divider px-4 m-0 mb-2 mt-1"></div>
                                                    
                            <form>
                                <div className="flex items-center px-3 py-2 rounded-lg">
                                    <textarea id="chat" rows={1} onChange={handleContent} className="block resize-none mx-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Add a comment..."></textarea>
                                        <button 
                                            type="submit" 
                                            onMouseOver={() => handleId(data.id)}
                                            onClick={() => {                                       
                                                handleSubmitComment();
                                            }}
                                            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
                                        >
                                        <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                                        </svg>
                                    </button>
                                </div>
                            </form>                                 

                            {visibleCommentList.map((comment)=>{
                                const commentCreateAt = new Date(comment.created_at).toLocaleString('zh-TW', { year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',hour12: true });                          
                                
                                return (
                                    <div key={comment.id} className="text-black p-4 antialiased flex">
                                        <img className="rounded-full h-8 w-8 mr-2 mt-1 " src="https://picsum.photos/id/1027/200/200"/>
                                        <div>
                                            <div className='indicator'>
                                            { comment.like.length > 0 && 
                                                <span className="indicator-item indicator-bottom badge badge-sm mb-2 bg-white shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#2563EB" className="me-1" viewBox="0 0 16 16">
                                                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                                    </svg>
                                                    {comment.like.length}                                   
                                                </span>
                                            }
                                            <div className="bg-gray-100 rounded-lg px-4 pt-2 pb-2.5">
                                                <div className="font-semibold text-sm leading-relaxed">Sara Lauren</div>
                                                <div className="text-xs leading-snug md:leading-normal">{comment.content}</div>                                       
                                            </div>
                                            </div>
                                            <div className='flex'>
                                                <button onMouseOver={()=>{handleId(comment.id)}} onClick={()=>{handleCommentLike(postId)}}><p className='text-xs mt-0.5 me-3 ml-1'>Like</p></button>
                                                <div className="text-xs mt-0.5 text-gray-500">{commentCreateAt}</div>
                                            </div>
                                        </div>
                                        <div className="dropdown dropdown-bottom flex">
                                            <button tabIndex={0} className='items-center ml-2 mb-3'>
                                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                                </svg>
                                            </button>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" onMouseOver={()=>{setPostId(comment.id)}} onClick={()=>{handleId(comment.id)}}>
                                                <li><Link to="#" onClick={()=>{
                                                    handleDeleteComment(postId)
                                                }}>刪除留言</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                )
                            })}

                            {visibleComments < data.comments.length && (
                                <button onClick={() => setVisibleComments(visibleComments + 5)}>
                                    查看更多留言
                                </button>
                            )}

                        </div>
                    </div>
                )
            })}

        </div>
    );
};

export default Post;
