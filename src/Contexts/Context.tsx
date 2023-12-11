import { PropsWithChildren, createContext, useState, useEffect } from 'react';
import UserService from '../API/User';
import { Socket } from "socket.io-client";
type ContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  content: string; 
  setContent: (content: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  ws: Socket| undefined;
  setWs: (ws:Socket| undefined) =>void;

  friendList: any[];
  setFriendList :(friendList: any[]) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ContextType['theme']>('');
  const [content, setContent] = useState<ContextType['content']>('');
  const [currentUser, setCurrentUser] = useState<ContextType['currentUser']>('');
  
  const [friendList, setFriendList] = useState<ContextType['friendList']>([]);

  const [ws, setWs] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await UserService.getCurrentUser();
        const user = response.data;
        setCurrentUser(user);
      } catch (error) {
        console.error('無法獲取使用者資訊', error);
      }
    };

    fetchUserInfo();    
  }, []);


  return (
    <Context.Provider value={{ theme,friendList, setFriendList, setTheme, ws, setWs, content, setContent,currentUser, setCurrentUser }}>
      {children}
    </Context.Provider>
  );
};

