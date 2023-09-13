import { PropsWithChildren, createContext, useState } from 'react';

type ContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};
export const Context = createContext<ContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ContextType['theme']>('');

  return (
    <Context.Provider value={{ theme, setTheme }}>
      {children}
    </Context.Provider>
  );
};

