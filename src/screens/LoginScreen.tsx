import { Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'

const LoginScreen = () => {
  const [username, setUserName] = useState('Username')
  const [password, setPassword] = useState('Password')

  const { addToast } = useToasts()

  const onSubmit = () => {
    try {
      throw new Error('Nope')
    } catch (e) {
      addToast((e as Error).message || 'Something went wrong', {
        appearance: 'error'
      })
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Typography style={{ marginTop: '8px' }}>3Nickels Login</Typography>
      <Input
        style={{ marginTop: '8px' }}
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <Input
        style={{ marginTop: '8px' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button style={{ marginTop: '8px' }} onClick={onSubmit}>
        Login
      </Button>
    </div>
  )
}

export default LoginScreen
