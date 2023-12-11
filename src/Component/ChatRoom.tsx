import React, { useEffect, useContext } from "react";
import { useState, KeyboardEvent } from 'react';
import { io, Socket } from "socket.io-client";
import { Chatroom, ChatLogItem,ChatLogStore, ChatContext } from '../Contexts/ChatContext';
import { Context } from "../Contexts/Context";

interface ServerToClientEvents {
  onMessageReceived: (data: ChatLogItem) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  //onMessageSent: (data: ChatLogItem) => void;
  onMessageSent: (data: ChatLogItem) => void;
  onClientConnected :(data:ChatLogItem) =>void;
}

// 還沒弄chatroom id 不知道怎麼弄 煩死
// interface ChatLogItem {
//   user_uuid: string;
//   chatroom_uuid: string;
//   message: string;
//   timestamp: number;
// }

//const user_uuid: string = uuidv4();

function ChatRoom() {
  const chatContext = useContext(ChatContext);
  const { chatrooms, setChatrooms} = chatContext;
  const { chatlog, setChatlog } = chatContext;

  const { openChatroomWindow, closeChatroomWindow} = chatContext;

  // 取得jwt中的uid
  const jwt = localStorage.getItem('user') as any
  const token = JSON.parse(jwt).token
  const [header, payload] = token.slice(4,).split('.');
  const decodedPayload = JSON.parse(atob(payload));

  const userUuid: string = decodedPayload.uid

  const { friendList } = useContext(Context)!;

  const [ws, setWS] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined);
  useEffect(() => {
    const token = localStorage.getItem('user') as string
    setWS(io('http://localhost:8080', {
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
      ws.on("onMessageReceived", async(data:any) => {
        console.log('why')
        console.log(data)
        if(data.user_id.id !== decodedPayload.id){
          await addNewMessage(data.chatroomUuid, data)
        }
    //     console.log(chatlog)
    //     console.log(chatlog[parseInt(data.chatroomUuid)])
    // if(chatlog[parseInt(data.chatroomUuid)]){
    //      if(data.user_id.id !== decodedPayload.id){
    //       const temp = chatlog[parseInt(data.chatroomUuid)]
    //       const filteredArray = await temp.filter((each:any) => each.id === data.id);
    //      console.log(filteredArray)
    //       if(filteredArray.length===0){
    //         addNewMessage(data.chatroomUuid, data)
    //       }
             
    //         }

        // 本來要從聊天使抓兩個朋友
        // const index = await chatrooms.findIndex((each:any) => each.id ===data.chatroomUuid)
        // console.log(data)
        // if (index>=0) {
        //   const temp = chatrooms[index] as any
        //   temp.user_id.map((each:any) => {
        //    if(each.id !== data.user_id.id){
        //       addNewMessage(data.chatroomUuid, data)
        //     }
        //   }
        //     )
          //}
          
          console.log(`receive => message: ${data.text}`);
        

      })
    }

  }, [ws])

  // 更新特定 chatroomItem
  const updateChatroom = (chatroomUuid: string, updatedData: Partial<Chatroom>) => {
    const updatedList = chatrooms.map(chatroom => {
      if (chatroom.chatroomUuid === chatroomUuid) {
        return { ...chatroom, ...updatedData };
      }
      return chatroom;
    });

    setChatrooms(updatedList);
  };


  // socket.on("onMessageReceived", (data) => {
  //   // const { userUuid, chatroomUuid, message, timestamp } = data;
  //   setChatLog([...chatLog,data]);
  //   console.log(`receive => message: ${data.message}`);

  //   //console.log(`receive => userUuid: ${data.userUuid}, message: ${data.message}`);
  // });
  // chatroom window status
  
  // const openWindow = (item: Chatroom) => {
  //   updateChatroom(item.chatroomUuid, {isWindowOpen: true});
  // };

  // const closeWindow = (item: Chatroom) => {
  //   updateChatroom(item.chatroomUuid, {isWindowOpen: false});
  // };

// 在用户发送消息时更新 chatroom_id 对应的聊天记录
  const addNewMessage = (chatroom_id: number, newMessage: ChatLogItem) => {
    setChatlog((prevChatlog: any) => {
      const currentChatlog = prevChatlog[chatroom_id] || [];
      // 不知道為什麼websocket都會發好幾次一樣的要求，所以避免重複顯示文字
      // 自己發訊息
      if(!newMessage.id){
        const updatedChatlog = [...currentChatlog, newMessage];
        return { ...prevChatlog, [chatroom_id]: updatedChatlog };
      }else{
        // 接收websocket訊息
        const test = currentChatlog.filter((each:any) => each.id === newMessage.id)
        console.log(test)
        if(test.length===0){
          const updatedChatlog = [...currentChatlog, newMessage];
          return { ...prevChatlog, [chatroom_id]: updatedChatlog };
        }else{
          return { ...prevChatlog, [chatroom_id]: currentChatlog };
        }

      }
      
    });
  };


  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>, chatroom: any) => {
    if (event.key === 'Enter') {

      const value = event.currentTarget.value;
      const data = {
        user_id: {id:decodedPayload.id},
        chatroomUuid: chatroom.id,
        text: value,
        createdAt: Date.now().toString()
      }
      addNewMessage(chatroom.id, data)
      ws?.emit("onMessageSent", data );
      
      console.log(`send => userUuid: ${ decodedPayload.id},chatroomUuid:${chatroom.id} message: ${value}`);

      event.currentTarget.value = '';
    }
  };
  useEffect(() => {
    console.log(chatrooms)
  }, [chatrooms])

  return (
    <div className="fixed bottom-0 right-0 flex">
      {chatrooms.map((chatroomItem:any, chatroomIndex) => (
        chatroomItem.isWindowOpen ? (
          <div key={chatroomIndex}>
            <div className="bg-white mx-6 w-80 h-96 border border-slate-300 shadow-xl shadow-gray-900 rounded-t-lg flex flex-col">
              <div className="shadow bottom-0 left-0 h-15 grid grid-cols-9">
                <div className="col-span-7 mx-1 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-15 w-12 p-2 rounded border-full border-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <div className="flex flex-col py-1">
                    <div className="text-left font-semibold text-base">{chatroomItem.name}</div>
                    <div className="text-left text-sm">目前在線上</div>
                  </div>
                </div>
                <div className="flex">
                  <div onClick={() => closeChatroomWindow(decodedPayload.id,chatroomItem.id)} className="w-full p-1 justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-full h-full text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12h-15"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex">
                  <div onClick={() => closeChatroomWindow(decodedPayload.id,chatroomItem.id)} className="w-full p-1 justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-full h-full text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="fixed bottom-14 w-80 px-2 shadow-inner">
                {chatlog[chatroomItem.id] && chatlog[chatroomItem.id].map((chatLogItem, chatLogIndex) => (
                  chatLogItem.user_id.id !== decodedPayload.id? (
                    <div key={chatLogIndex} className="chat chat-start">
                      <div className="chat-bubble bg-gray-200 text-black">{chatLogItem.text}</div>
                    </div>
                  ) : (
                    <div key={chatLogIndex} className="chat chat-end">
                      <div className="chat-bubble bg-blue-400 text-white">{chatLogItem.text}</div>
                    </div>
                  )
                ))}
                {/* <div className="chat chat-start">
                      <div className="chat-bubble bg-gray-200 text-black">今天天氣晴!</div>
                    </div>
                    <div className="chat chat-end">
                      <div className="chat-bubble bg-blue-400 text-white">我想要吃蛋餅</div>
                    </div> */}
              </div>

              <div className="fixed bottom-0 w-80 h-12 grid grid-cols-6">
                <div className="h-12 py-1 col-span-5">
                  <div className="mx-2 h-full bg-gray-100 rounded-full">
                    <input
                      placeholder="Aa"
                      onKeyPress={(event) => handleEnterPress(event, chatroomItem)}
                      className="h-full bg-transparent ml-4 focus:outline-none text-lg"
                    />
                  </div>
                </div>
                <div className="h-12">
                  <div className="w-12 p-2 justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full text-blue-400"
                    >
                      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ): <></>
        ))
        
        
      }

      <div className="w-20 relative">
        <div className="fixed bottom-0 w-20 h-20 p-2">
          <div className="w-full h-full border rounded-full p-4 bg-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
