import { PropsWithChildren, createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Chatroom {
  userName: string;
  userUuid: string;
  chatroomUuid: string;
  isWindowOpen: boolean;
}

export interface ChatLogItem {
  userUuid: string;
  chatroomUuid: string;
  message: string;
  timestamp: number;
}

export type ContextType = {
  chatrooms: Chatroom[];
  setChatrooms: (chatrooms: Chatroom[]) => void;
  chatlog: ChatLogItem[];
  setChatlog: (chatlog: ChatLogItem[]) => void;
  addChatroom: (userName: string, userUuid: string, isWindowOpen: boolean) => void;
  openChatroomWindow: (userUuid: string,chatroomUuid: string ) => void;
  closeChatroomWindow: (userUuid: string,chatroomUuid: string) => void;
};

export const ChatContext = createContext<ContextType>({
  chatrooms: [],
  setChatrooms: () => {},
  chatlog: [],
  setChatlog: () => {},
  addChatroom: () => {}, 
  openChatroomWindow: () => {}, 
  closeChatroomWindow: () => {}, 
});

export const ChatContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [chatrooms, setChatrooms] = useState<ContextType['chatrooms']>([]);
  const [chatlog, setChatlog] = useState<ContextType['chatlog']>([]);

  // 檢查 user uuid 是否存在在 chatrooms
  function isUserInChatrooms(userUuid: string): boolean {
    return chatrooms.some(chatroom => chatroom.userUuid === userUuid);
  }

  // 依照 userUuid 更新 isWindowOpen 狀態
  function updateIsWindowOpen(userUuid: string, chatroomUuid: string,newIsWindowOpen: boolean): void {
    const index = chatrooms.findIndex(chatroom => chatroom.userUuid === userUuid && chatroom.chatroomUuid === chatroomUuid);
    if (index !== -1) chatrooms[index].isWindowOpen = newIsWindowOpen;
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
