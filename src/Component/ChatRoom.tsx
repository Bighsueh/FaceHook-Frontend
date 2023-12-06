import React, { useEffect, useContext } from "react";
import { useState, KeyboardEvent } from 'react';
import { io, Socket } from "socket.io-client";
import { Chatroom, ChatLogItem, ChatContext } from '../Contexts/ChatContext';
import { Context } from "../Contexts/Context";

interface ServerToClientEvents {
  onMessageReceived: (data: ChatLogItem) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  onMessageSent: (data: ChatLogItem) => void;
  onClientConnected: (data: ChatLogItem) => void;
}


function ChatRoom() {
  const chatContext = useContext(ChatContext);
  const { chatrooms, setChatrooms} = chatContext;
  const { chatlog, setChatlog} = chatContext;
  const { openChatroomWindow, closeChatroomWindow} = chatContext;

  // const [chatLog, setChatLog] = useState<ChatLogItem[]>([]);
  // const [chatroomList, setChatroomList] = useState<Chatroom[]>([]);

  // 取得jwt中的uid
  const jwt = localStorage.getItem('user') as any
  const token = JSON.parse(jwt).token
  const [header, payload] = token.slice(4,).split('.');
  const decodedPayload = JSON.parse(atob(payload));

  const userUuid: string = decodedPayload.uid
  console.log(userUuid)

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
      ws.on("onMessageReceived", (data) => {
        if (data.userUuid !== userUuid) {
          console.log(chatlog)
          // const { userUuid, chatroomUuid, message, timestamp } = data;
          //setChatLog([...chatLog, data]);
          setChatlog([...chatlog, data]);
          console.log(data)
          console.log(`receive => message: ${data.message}`);
        }

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

  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>, chatroom: Chatroom) => {
    if (event.key === 'Enter') {

      const value = event.currentTarget.value;
      const data = {
        userUuid: userUuid,
        chatroomUuid: userUuid,
        message: value,
        timestamp: Date.now()
      }
      ws?.emit("onMessageSent", {
        userUuid: userUuid,
        chatroomUuid: chatroom.chatroomUuid,
        message: value,
        timestamp: Date.now()
      });

      setChatlog([...chatlog, data])

      console.log(`send => userUuid: ${userUuid},chatroomUuid:${chatroom.chatroomUuid} message: ${value}`);

      event.currentTarget.value = '';
    }
  };
  useEffect(() => {
    console.log(chatlog)
  }, [chatlog])

  return (
    <div className="fixed bottom-0 right-0 flex">
      {chatrooms.map((chatroomItem, chatroomIndex) => (
        chatroomItem.isWindowOpen ? (
          <div key={chatroomIndex}>
            <div className="bg-white mx-6 w-80 h-96 border border-slate-300 shadow-xl shadow-gray-900 rounded-t-lg flex flex-col">
              <div className="shadow bottom-0 left-0 h-12 grid grid-cols-9">
                <div className="col-span-7 mx-1 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-12 w-12 p-2 rounded border-full border-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <div className="text-left font-semibold text-base">{chatroomItem.userName}</div>
                    <div className="text-left text-sm">目前在線上</div>
                  </div>
                </div>
                <div className="flex">
                  <div onClick={() => closeChatroomWindow(chatroomItem.userUuid)} className="w-full p-1 justify-center">
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
                  <div onClick={() => closeChatroomWindow(chatroomItem.userUuid)} className="w-full p-1 justify-center">
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
                {chatlog.map((chatLogItem, chatLogIndex) => (
                  chatLogItem.chatroomUuid !== chatroomItem.chatroomUuid ? (
                    <div key={chatLogIndex} className="chat chat-start">
                      <div className="chat-bubble bg-gray-200 text-black">{chatLogItem.message}</div>
                    </div>
                  ) : (
                    <div key={chatLogIndex} className="chat chat-end">
                      <div className="chat-bubble bg-blue-400 text-white">{chatLogItem.message}</div>
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
