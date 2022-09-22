import React from 'react'
import './App.css'
import LoginScreen from './screens/LoginScreen'
import { ToastProvider } from 'react-toast-notifications'
import { AuthProvider } from './AuthContext'
import useConstant from './hooks/useConstant'
import { AuthStore } from './AuthStore'

function App(): JSX.Element {

  const authStore = useConstant<AuthStore>(() => new AuthStore())

  return (
    <AuthProvider authStore={authStore}>
      <ToastProvider autoDismiss={true} placement='top-right'>
        <div className='App'>
          <LoginScreen />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
