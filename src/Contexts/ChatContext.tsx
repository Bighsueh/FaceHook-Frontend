import { PropsWithChildren, createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatService from '../API/Chat';
export interface Chatroom {
  userName: string;
  userUuid: string;
  chatroomUuid: string;
  isWindowOpen: boolean;
}

// export interface ChatLogItem {
//   userUuid: string;
//   chatroomUuid: string;
//   message: string;
//   timestamp: number;
// }
export interface ChatLogItem {
  id?: string;
  text: string;
  createdAt: string;
  user_id: {
    id:number
    uid?: string,
    username?: string,
    email?: string,
    password?: string
  };
  is_return?: boolean;
  type?: string,
}

export interface ChatLogStore {
  [chatroom_id: number]: ChatLogItem[];
}

export type ContextType = {
  chatrooms: Chatroom[];
  setChatrooms: (chatrooms: Chatroom[]) => void;
  chatlog: ChatLogStore ;
  // 這樣宣告就不行 TS毛病一堆:(
  //setChatlog: (chatlog: ChatLogStore) => void;
  setChatlog: React.Dispatch<React.SetStateAction<ChatLogStore>>;

  
  addChatroom: (userName: string, userUuid: string, isWindowOpen: boolean) => void;
  openChatroomWindow: (userUuid: string,chatroomUuid: string ) => void;
  closeChatroomWindow: (userUuid: string,chatroomUuid: string) => void;
};

export const ChatContext = createContext<ContextType>({
  chatrooms: [],
  setChatrooms: () => {},
  chatlog: {},
  setChatlog: () => {},
  addChatroom: () => {}, 
  openChatroomWindow: () => {}, 
  closeChatroomWindow: () => {}, 
});

export const ChatContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [chatrooms, setChatrooms] = useState<ContextType['chatrooms']>([]);
  const [chatlog, setChatlog] = useState<ContextType['chatlog']>({});

  // 檢查 user uuid 是否存在在 chatrooms
  function isUserInChatrooms(userUuid: string): boolean {
    return chatrooms.some(chatroom => chatroom.userUuid === userUuid);
  }


  // 在某个地方更新 chatroom_id 对应的聊天记录
  const updateChatlog = (chatroom_id: number, newChatLog: ChatLogItem[]) => {
    console.log(chatlog)
    console.log(newChatLog)
    setChatlog((prevChatlog) => {
      return { ...prevChatlog, [chatroom_id]: [...newChatLog] };
    });
  };


  // 依照 userUuid 更新 isWindowOpen 狀態
  function updateIsWindowOpen(userUuid: string, chatroomUuid: string,newIsWindowOpen: boolean): void {
    // 取得聊天歷史紀錄
    if(newIsWindowOpen){
      ChatService.getChatLog(parseInt(chatroomUuid))
      .then((chatLogData) => {
        const newChatLog: ChatLogItem[] = chatLogData.data;
        updateChatlog(parseInt(chatroomUuid), newChatLog);
      }).catch(err =>{
        console.log(err)
      })
    }
    const index = chatrooms.findIndex((chatroom:any) => chatroom.id === chatroomUuid);
    const cid= chatrooms[index] as any
    //const index = chatrooms.findIndex(chatroom => chatroom.userUuid === userUuid && chatroom.chatroomUuid === chatroomUuid);
    // 這樣useState才會重新渲染
    if (index !== -1) {
      setChatrooms((prevChatroom) => (
        prevChatroom.map((room:any) => {
          console.log(room)
          if (room.id === cid.id) {
            return {
              ...room,
              isWindowOpen: newIsWindowOpen
            };
          }
          return room;
        })
      ))
  }
  }

  // 開啟聊天室
  const openChatroomWindow = (
    userUuid: string,
    chatroomUuid: string,
  ) => {
    updateIsWindowOpen(userUuid, chatroomUuid, true);
  }

  // 關閉聊天室
  const closeChatroomWindow = (
    userUuid: string,
    chatroomUuid: string,
  ) => {
    updateIsWindowOpen(userUuid, chatroomUuid, false);
  }
  
  // 新增聊天室
  const addChatroom = (
    userName: string,
    userUuid: string,
    isWindowOpen: boolean,
  ) => {

    //check exist.
    if(! isUserInChatrooms(userUuid)){
      const chatroomUuid: string = uuidv4();

      let newChatroom: Chatroom = {
        userName: userName,
        userUuid: userUuid,
        chatroomUuid: chatroomUuid,
        isWindowOpen: isWindowOpen,
      };
  
      console.log('add: '+ userName );
      setChatrooms([...chatrooms, newChatroom]);
    }
  };

  return (
    <ChatContext.Provider value={{ chatrooms, setChatrooms, chatlog, setChatlog, addChatroom, openChatroomWindow, closeChatroomWindow }}>
      {children}
    </ChatContext.Provider>
  );
};
