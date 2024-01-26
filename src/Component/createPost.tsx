import React, { useState,useEffect,useContext,useRef} from 'react';
import PostService from "../API/Post";
import { Link } from 'react-router-dom';
import { Context } from '../Contexts/Context';
import axios from 'axios';

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
    const uploadImages = async () => {
      const formData = new FormData();
      // 将每个文件分别附加到 formData
      for (const file of files) {
          //const newFileName = `${file.name}.${file.type.split('/').pop()}`;
          formData.append('images', file);
          //console.log(formData);
      }
      
      try {
        const response = await PostService.postPhoto(formData);
        setImageName(response.data.imageName);
        
      } catch (error) {
          
        console.error('Error uploading image:', error);
      }
     
    };

    const [files, setFiles] = useState<File[]>([]);// 使用数组来存储多个文件
    const [imageName, setImageName] = useState("");
    const [previewImages, setPreviewImages] = useState<{ url: string; name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showDiv, setShowDiv] = useState(false);
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        
        if (e.target.files ) {
            const selectedFiles = Array.from (e.target.files) as File[];// 将 FileList 转换为数组
          //const selectedFileName = selectedFiles.name; // 取得檔案名稱
          //setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // 更新状态以包含多个文件
          
          //const previewImages = selectedFiles.map(file => URL.createObjectURL(file));
          setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
          const previewImages = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
          }));
          
          //const previewImages = selec
          console.log('John is here'+e.target.files);
          setPreviewImages((prevImages) => [...prevImages, ...previewImages]); // 设置预览图像数组
          //setPreviewImages((previewImages) => [...previewImages, ...previewImages]);
        }
      };
  // 删除指定索引的图像
  const handleDeleteImage = (e: React.MouseEvent, index: number) => {
      e.stopPropagation(); // 阻止事件冒泡
  
      // 创建新的预览图像数组，不包括要删除的图像
      const newPreviewImages = [...previewImages];
      newPreviewImages.splice(index, 1);
      // 创建新的文件数组，不包括要删除的文件
      const newFiles =[files]
      newFiles.splice(index, 1);
      // 更新状态以反映删除后的数组
      setPreviewImages(newPreviewImages);
      setFiles(newFiles.flat());
  };
  
  const handleButtonClick = () => {
      // 触发文件输入框的点击事件
      //檔案上傳功能
      
      //產生div框框
      setShowDiv(!showDiv); 
    };
  const fileDownloadButtonClick =()=> {
      //檔案上傳功能
      if (fileInputRef.current) {
          fileInputRef.current.click();
        }
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
              {showDiv && (
                    <div  onClick={fileDownloadButtonClick} className="border border-black w-96 h-48 p-5 m-5 flex items-center justify-center
                    grid grid-cols-5 overflow-hidden">
                    新增相片/影片
                    

                    {previewImages.map((images, index) => (
                    <div key={index} className=" relative p-1  max-w-full">
                        <div className="relative">
                        <img src={images.url} alt="Preview" className="w-full h-full object-contain" />
                        
                        
                        <div className=" absolute top-0 right-0  text-white px-2 py-1 rounded-sm m-1 "
                        onClick={(e) => handleDeleteImage(e, index)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        </div>
                    
                        </div>
                    </div>
                    ))}
                    
                    </div>
                )}
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
                      <button className="inline-flex items-center justify-center w-10 h-10 mr-2  ml-2 text-indigo-100 transition-colors duration-150 bg-mistblue rounded-full focus:shadow-outline hover:bg-indigo-800"
                      onClick={handleButtonClick}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-image" viewBox="0 0 16 16">
                              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                          </svg>                    
                      </button>
                      <button className="inline-flex items-center justify-center w-10 h-10 mr-2 text-indigo-100 transition-colors duration-150 bg-mistblue rounded-full focus:shadow-outline hover:bg-indigo-800">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-paperclip" viewBox="0 0 16 16">
                              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                          </svg>                  
                      </button>
                      <form method="dialog" className='ms-auto '>
                          <button 
                                type="submit" 
                                className="bg-mistblue ms-auto items-center py-2.5 px-4 text-xs font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                                onClick={() => {
                                    handleSubmitPost();
                                    uploadImages();
                                  }}
                              >
                                  Post
                          </button>
                          {imageName && <img src={imageName} alt="Uploaded Image" />}
                      </form>
                  </div>
              </div>
            </dialog>
            </div>
            <div className="App">
           
            <input
               ref={fileInputRef}
               onChange={handleFileInputChange}
               type="file"
               accept="image/*"
               multiple // 允许多个文件
               style={{ display: 'none' }}
               ></input>
          </div>
        </div>
      );
    }