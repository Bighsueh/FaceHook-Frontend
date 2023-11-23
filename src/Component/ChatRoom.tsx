import React, { useEffect } from "react";
import { useState, KeyboardEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from "socket.io-client";
import { isConstructorDeclaration } from "typescript";

// 前後端的方法要一樣
interface ServerToClientEvents {
  onMessageReceived: (data: ChatLogItem) => void;
}
// 前後端的方法要一樣
interface ClientToServerEvents {
  hello: () => void;
  //onMessageSent: (data: ChatLogItem) => void;
  onMessageSent: (data: ChatLogItem) => void;
  onClientConnected :(data:ChatLogItem) =>void;
}

// 還沒弄chatroom id 不知道怎麼弄 煩死
interface ChatLogItem {
  user_uuid: string;
  chatroom_uuid: string;
  message: string;
  timestamp: number;
}

//const user_uuid: string = uuidv4();

function ChatRoom() {
  // 取得jwt中的uid
  const jwt = localStorage.getItem('user') as any
  // 麻煩的拿到裡面的uid
  const token = JSON.parse(jwt).token
  const [header, payload] = token.slice(4,).split('.');
  const decodedPayload = JSON.parse(atob(payload));


  const user_uuid: string = decodedPayload.uid
  console.log(user_uuid)

  const [chatLog, setChatLog] = useState<ChatLogItem[]>([]);
  const [ws, setWS] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined);
  useEffect(() => {
    // 把jwt做為參數傳到後端讓socket記錄下來 紀好之後發現好像沒啥用
    // 放到useEffect代表只會連線一次 
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
        if (data.user_uuid !== user_uuid) {
          console.log(chatLog)
          // const { user_uuid, chatroom_uuid, message, timestamp } = data;
          //setChatLog([...chatLog, data]);
          setChatLog(prevState => [...prevState, data]);
          console.log(data)
          console.log(`receive => message: ${data.message}`);
        }

      })
    }

  }, [ws])


  // socket.on("onMessageReceived", (data) => {
  //   // const { user_uuid, chatroom_uuid, message, timestamp } = data;
  //   setChatLog([...chatLog,data]);
  //   console.log(`receive => message: ${data.message}`);

  //   //console.log(`receive => user_uuid: ${data.user_uuid}, message: ${data.message}`);
  // });


  const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      const value = event.currentTarget.value;
      const data = {
        user_uuid: user_uuid,
        chatroom_uuid: '1',
        message: value,
        timestamp: Date.now()
      }
      ws?.emit("onMessageSent", {
        user_uuid: user_uuid,
        chatroom_uuid: '1',
        message: value,
        timestamp: Date.now()
      });
      //ws?.emit("onMessageSent", data );

      setChatLog([...chatLog, data])

      console.log(`send => user_uuid: ${user_uuid}, message: ${value}`);

      event.currentTarget.value = '';
    }
  };
  useEffect(() => {
    console.log(chatLog)
  }, [chatLog])

  return (
    <div className="absolute bottom-0 right-0 flex">
      <div className="mx-6 w-80 h-96  border border-2 rounded-t-lg flex flex-col">
        <div className="border-b-2 bottom-0 left-0 h-12 grid grid-cols-9">
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
              <div className="text-left font-semibold text-base">薛孟君</div>
              <div className="text-left text-sm">5分鐘前在線上</div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full p-1 justify-center">
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
            <div className="w-full p-1 justify-center">
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
        <div className="fixed bottom-14 w-80 px-2">
          {chatLog.map((item, index) => (
            item.user_uuid !== user_uuid ? (
              <div key={index} className="chat chat-start">
                <div className="chat-bubble bg-gray-200 text-black">{item.message}</div>
              </div>
            ) : (
              <div key={index} className="chat chat-end">
                <div className="chat-bubble bg-blue-400 text-white">{item.message}</div>
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
                onKeyPress={handleEnterPress}
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
      <div className="w-20 relative">
        <div className="fixed bottom-0 w-20 h-20 p-2">
          <div className="w-full h-full border rounded-full p-4 bg-blue-400" >
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
