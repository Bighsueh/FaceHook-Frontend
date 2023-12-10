import React, { useContext, useEffect, useState } from 'react';
import UserService from "../API/User";
import { Context } from '../Contexts/Context';
import { Chatroom, ChatLogItem, ChatContext } from '../Contexts/ChatContext';
import { v4 as uuidv4 } from 'uuid';

import ChatService from '../API/Chat';

function RightSideBar() {
  const chatContext = useContext(ChatContext);
  const { chatrooms, setChatrooms, addChatroom } = chatContext;
  const { openChatroomWindow, closeChatroomWindow } = chatContext;

  // 取得 jwt 中的 user id
  const jwt = localStorage.getItem('user') as any;
  const token = JSON.parse(jwt).token;
  const [header, payload] = token.slice(4,).split('.');
  const decodedPayload = JSON.parse(atob(payload));

  const userId = decodedPayload.id;

  //取得好友列表
  const [friendList, setFriendList] = useState<any[]>([]);

  useEffect(() => {
    UserService.getCurrentFriends(userId)
      .then((friendData) => {
        // get allChatroom by user
        ChatService.getAllRoom(userId)
          .then((chatroomData) => {
            setChatrooms(chatroomData.data)
            console.log(chatroomData.data)

            const mergedList = friendData.data.map((friend: any) => {
              //用朋友去找才不會重複
              const userId = friend.freiend_user_id.id;

              // 找到對應的聊天室
              const matchingChatroom = chatroomData.data.find((room:any) =>
                room.user_id.some((user:any) => user.id === userId)
              );

              // 如果找到聊天室，合併到好友列表中
              if (matchingChatroom) {
                return {
                  ...friend,
                  chatroom_id: matchingChatroom.id
                };
              }

              // 如果沒找到聊天室，保留原本的好友資訊
              return { ...friend };
            });

            console.log(mergedList)
            setFriendList(mergedList)
          }).catch((e) => {
            console.log(e);
          })

        //setFriendList(friendData.data);
        console.log(friendData.data)
      })
      .catch((e) => {
        console.log(e);
      })


  }, [userId])

  return (

    <div className='flex flex-col pt-6 w-64 bg-lightblue h-full w-full px-4 py-4'>
      {/* Sponsored Area Begin*/}
      <div className='my-2 mx-2 flex font-bold'>Sponsored</div>
      <div className='flex rounded-lg'>
        <img
          src="https://fastly.picsum.photos/id/348/3872/2592.jpg?hmac=I51bqSjuTk6zKHgtJDpMLY3kSSfAXdB8AHGmWf-Eq1Q"
          className="object-fill w-fit h-fit rounded-b"
          alt="cover"
        />
      </div>
      <div className="mx-2 font-bold">WuLab 人才培育中心</div>
      <div className="mx-2 font-base">發現未來的高階專業人才，踏上成功之路！我們的人才培育中心為您量身打造專業課程，結合實務導向教學與產業合作，培養創新思維及卓越技能。在這裡，夢想成真，未來由您主宰！</div>
      {/* Sponsored Area End*/}

      <div className='my-2 mx-2 mt-4 pt-4 flex font-bold'>Friends</div>
      <div className="my-2 mx-2 border border-5 border-gray-300"></div>

      {
        friendList.map((friendItem, friendIndex) => (
          <div className='flex flex-col items-center' key={friendIndex}>

            <div onClick={() => openChatroomWindow(friendItem.freiend_user_id.uid, friendItem.chatroom_id)}
              className='mx-2 py-1 flex justify-start items-center border border-none rounded w-full hover:bg-hoverLightBlue'>
              <div className="flex space-x-2 mx-2">
                <img
                  src="https://picsum.photos/id/1025/500"
                  alt="img"
                  className="h-10 w-10 rounded-full mt-1"
                />
              </div>
              <div className='mx-2 font-bold'>{friendItem.freiend_user_id.username}</div>
            </div>
          </div>
        ))

      }


    </div>






  )
}

export default RightSideBar