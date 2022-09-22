import React from 'react'
import './App.css'
import LoginScreen from './screens/LoginScreen'
import { ToastProvider } from 'react-toast-notifications'

function App(): JSX.Element {
  return (
    <ToastProvider autoDismiss={true} placement='top-right'>
      <div className='App'>
        <LoginScreen />
      </div>
    </ToastProvider>
  )
}

export default App
