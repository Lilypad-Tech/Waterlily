import { createContext, useContext, FC } from 'react';

type NavigationContextType = {
  handleNavigation: (page: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface MyContextProviderProps {
  handleNavigation: (page: string) => void;
  children: React.ReactNode;
}

export const NavigationContextProvider = ({
  handleNavigation,
  children,
}: MyContextProviderProps) => {
  return (
    <NavigationContext.Provider value={{ handleNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      'useNavigation must be used within NavigationContextProvider'
    );
  }
  return context;
};
