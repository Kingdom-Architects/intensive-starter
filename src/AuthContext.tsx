import { createContext, useContext } from 'react'
import { AuthStore } from './AuthStore';


export const AuthContext = createContext<null | AuthStore>(null);

interface AuthContextProps {
    authStore: AuthStore;
}

export const AuthProvider: React.FC<AuthContextProps>  = ({ children, authStore }) => {
  return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('No auth provided')
  }

  return auth
}
