import { createContext } from 'react';

type AuthContextType = {

};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
