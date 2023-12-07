import React, { useEffect, useState,useContext } from 'react';
import PostService from "../API/Post";
import UserService from "../API/User";
import { Link,useLocation } from 'react-router-dom';
import { Context } from '../Contexts/Context';

interface Comment {
  createdAt: string; 
  content: string;
  id: number;
  like: any;
  user_id: any;
}

export default function MainPost({userId}:any) {

    const location = useLocation();

    const [postData, setPostData] = useState<any[]>([]);
    const [newpost, setNewpost] = useState<string>("");
    const [postId, setPostId] = useState<any>();
    const [likedPosts, setLikedPosts] = useState<{ [postId: number]: boolean }>({});
    const [likedComments, setLikedComments] = useState<{ [postId: number]: boolean }>({});
    const [visibleComments, setVisibleComments] = useState<number>(2);
    const [shareOption, setShareOption] = useState<string>("所有人");
    const { content,setContent,currentUser,ws } = useContext(Context)!;
    const [page,setPage] = useState<string>("");

    useEffect(() => {
    const fetchData = async (getDataPromise:any) => {
      try {
        const data = await getDataPromise();
        console.log(data);

        const updatedLikedPosts: { [postId: number]: boolean } = {};
        const updatedLikedComments: { [postId: number]: boolean } = {};

        data.data.forEach((post: any) => {
            post.like.forEach((like: any) => {
            if (like.user_id.id === currentUser?.id) {
                updatedLikedPosts[post.id] = true;
            }
            });
            post.comments.forEach((comment: Comment) => {
                comment.like.forEach((commentLike: any) => {
                  if (commentLike.user_id.id === currentUser?.id) {
                    updatedLikedComments[comment.id] = true;
                  }
                });
            });
        });
        // 更新 likedPosts
        setLikedPosts(updatedLikedPosts);
        setLikedComments(updatedLikedComments);
        setPostData(data.data);

      } catch (error) {
        console.error(error);
      }
    };
    if (location.pathname === '/') {
      fetchData(() => PostService.getPost());
      setPage("homepage")
    } else if (location.pathname.startsWith('/personal/')) {
      fetchData(() => UserService.getUserPosts(userId));
      setPage("profile")
    }
  }, [newpost,content, location]);
  


    const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const handleId = (id: number) => {
      setPostId(id);
      console.log(postId);
    };
    const handleSubmitComment = () => {
        if (content !== undefined && content !== null && content !== ""){
            PostService.postComment(postId, content)
            .then((data) => {
                ws?.emit("onCommentSend", data.data)
                // alert("新增成功");
                setContent("")
            })
            .catch((e) => {
                console.log(e);
            });
        } else {
            window.alert("請輸入內容");
        }
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
              setShareOption(data.data.group)
              setContent(data.data.content);
          })
          .catch((e) => {
              console.log(e);
              window.alert(e.response.data);
          });
    };
    const handleUpdatePost = () => {
        PostService.updatePost(postId, content,shareOption)
            .then(() => {
                window.alert("修改成功");
                setContent("")
                setNewpost(content);
            })
            .catch((e) => {
                console.log(e);
                window.alert(e.response.data);
            });
    };
    const handleLike = (postId: number) => {
       
        PostService.likePost(postId)
            .then((data) => {
                console.log(data.data)
                ws?.emit("onLikeSend", data.data)
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
    const handleCommentLike = (commentId: number) => {
        if (likedComments[commentId]) {
          PostService.unlikeComment(commentId)
            .then(() => {
              setLikedComments((prevState) => ({
                ...prevState,
                [commentId]: false,
              }));
              setNewpost("unlikecomment" + commentId);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          PostService.likeComment(commentId)
            .then(() => {
              setLikedComments((prevState) => ({
                ...prevState,
                [commentId]: true,
              }));
              setNewpost("likecomment" + commentId);
            })
            .catch((e) => {
              console.log(e);
            });
        }
    };
    

  return (
    <>
      {postData !== null && postData.map((data)=>{

          const createdAt = new Date(data.createdAt).toLocaleString('zh-TW', { year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',hour12: true });
          const visibleCommentList = data.comments.slice(0, visibleComments) as Comment[];
          const isLiked = likedPosts[data.id] || false;
          const isFriendPost =
          page === "homepage" &&
          data.group === "朋友" &&
          data.user_id.friend.some((friend: any) => friend.freiend_user_id.id === currentUser?.id);

        return(
          <>
          {((data.group === "所有人") || (data.group === "朋友" && isFriendPost) || (data.user_id.id === currentUser.id) || (data.group === "只限本人" && data.user_id.id === currentUser.id)) && (
          <div id="postcard" key={data.id}>
            <div className="w-full shadow-fb rounded bg-white border border-gray-300 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://picsum.photos/id/1025/500"
                    alt="img"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-4">
                    <Link to={`/personal/${data.user_id.id}`}><span className="cursor-pointer font-bold">{data.user_id.username}</span>{' '}</Link>
                    <br />
                    <span className="text-fGrey text-opacity-50 text-sm">
                      {' '}
                      {createdAt}{'  '}
                      {data.group}
                    </span>
                  </div>
                </div>

                { currentUser?.id === data.user_id.id && (
                  <div className="dropdown dropdown-bottom dropdown-end flex">
                    <button tabIndex={0} className="w-9 h-9 rounded-full bg-fFill flex items-center justify-center focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="3"><g transform="translate(-1205 -635)" fill="#1d1f23"><circle cx="1.5" cy="1.5" r="1.5" transform="translate(1205 635)"/><circle cx="1.5" cy="1.5" r="1.5" transform="translate(1210 635)"/><circle cx="1.5" cy="1.5" r="1.5" transform="translate(1215 635)"/></g></svg>
                    </button>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <Link 
                                to="#"
                                onMouseOver={() => handleId(data.id)} 
                                onClick={() => {
                                    handleUpdateContent()
                                    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                                    modal.showModal();
                                }}       
                            >編輯貼文</Link>
                        </li>
                        <li><Link to="#" onClick={handleDeletePost}>刪除貼文</Link></li>
                    </ul>
                    <dialog id="my_modal_3" className="modal">
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
                                            <div className='font-semibold ml-0.5'>{currentUser?.username}</div>
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
                                className="ms-auto items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                                onClick={handleUpdatePost}
                                >
                                    Save
                                </button>
                                </form>
                            </div>                                
                        </div>
                    </dialog>
                  </div>
                )}


              </div>
              <div className="w-full mt-4">
                <p
                    className='text-gray-700 '
                    dangerouslySetInnerHTML={{
                        __html: data.content.replace(/\n/g, '<br>')
                    }}
                ></p> 
              </div>
              <img
                src="https://picsum.photos/id/1018/3000"
                alt="img"
                className="w-full h-72 object-cover mt-4 rounded"
              />
              <div className="flex justify-between mt-4 items-center text-fGrey text-opacity-50">
                <div>{data.like.length} Likes</div>
                <div>{data.comments.length} Comment</div>
              </div>

              <div className="border border-gray-300 border-opacity-75 mt-4" />

              <div className="flex justify-between items-center mt-2">

                {isLiked ? (
                  <button className="w-1/2 flex items-center justify-center focus:outline-none" onClick={() => handleUnLike(data.id)}>
                    <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#2563EB" viewBox="0 0 18 18">
                      <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"/>
                    </svg>
                    <span className="ml-2">Like</span>
                  </button>
                ) : (
                  <button className="w-1/2 flex items-center justify-center focus:outline-none" onClick={() => handleLike(data.id)}>
                    <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.008 8.714c1-.097 1.96-.45 2.792-1.028a25.112 25.112 0 0 0 4.454-5.72 1.8 1.8 0 0 1 .654-.706 1.742 1.742 0 0 1 1.65-.098 1.82 1.82 0 0 1 .97 1.128c.075.248.097.51.065.767l-1.562 4.629M4.008 8.714H1v9.257c0 .273.106.535.294.728a.99.99 0 0 0 .709.301h1.002a.99.99 0 0 0 .71-.301c.187-.193.293-.455.293-.728V8.714Zm8.02-1.028h4.968c.322 0 .64.08.925.232.286.153.531.374.716.645a2.108 2.108 0 0 1 .242 1.883l-2.36 7.2c-.288.813-.48 1.354-1.884 1.354-2.59 0-5.39-1.06-7.504-1.66"/>
                    </svg>
                    <span className="ml-2">Like</span>
                  </button>
                )}

                <button className="w-1/2 flex items-center justify-center focus:outline-none">
                  <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                  </svg>
                  <span className="ml-2">Comment</span>
                </button>

              </div>

              <div className="border border-gray-300 border-opacity-75 mt-2 mb-3" />

              <form>
                <div className="flex items-center px-2 py-2 rounded-lg">
                    <textarea id="chat" rows={1} onChange={(e)=>{setContent(e.target.value)}} className="block resize-none p-2.5 pl-4 w-full text-sm text-gray-900 bg-white rounded-2xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Add a comment..."></textarea>
                        <button 
                            type="submit" 
                            onMouseOver={() => handleId(data.id)}
                            onClick={() => {handleSubmitComment()}}
                            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
                        >
                        <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                        </svg>
                    </button>
                </div>
              </form>                                 

              {visibleCommentList.map((comment)=>{
                  const commentCreateAt = new Date(comment.createdAt).toLocaleString('zh-TW', { year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',hour12: true });                          
                  
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
                              <div className="bg-gray-100 rounded-lg px-4 ml-1 pt-2 pb-2.5">
                                  <div className="font-semibold text-sm leading-relaxed">{comment.user_id.username}</div>
                                  <div className="text-xs leading-snug md:leading-normal">{comment.content}</div>                                       
                              </div>
                              </div>
                              <div className='flex'>
                                  <button onMouseOver={()=>{handleId(comment.id)}} onClick={()=>{handleCommentLike(postId)}}><p className='text-xs mt-0.5 me-3 ml-1'>{likedComments[comment.id] ? "Unlike" : "Like"}</p></button>
                                  <div className="text-xs mt-0.5 text-gray-500">{commentCreateAt}</div>
                              </div>
                          </div>
                          { currentUser?.id === comment.user_id.id && (
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
                          )}
                      </div>
                  )
              })}

              {/* {visibleComments < data.comments.length && (
                  <button onClick={() => setVisibleComments(visibleComments + 5)}>
                      查看更多留言
                  </button>
              )} */}

            </div>
          </div>
          )}
          </>
        )
      })}   
    </>
  );
}