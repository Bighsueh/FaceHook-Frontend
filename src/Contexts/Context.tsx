import { PropsWithChildren, createContext, useState, useEffect } from 'react';
import UserService from '../API/User';

type ContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  content: string; 
  setContent: (content: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ContextType['theme']>('');
  const [content, setContent] = useState<ContextType['content']>('');
  const [currentUser, setCurrentUser] = useState<ContextType['currentUser']>('');

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
    <Context.Provider value={{ theme, setTheme, content, setContent,currentUser, setCurrentUser }}>
      {children}
    </Context.Provider>
  );
};

