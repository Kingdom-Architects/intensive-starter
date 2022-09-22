import { Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'

const LoginScreen = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const onSubmit = () => {
    try {
      throw new Error('Nope')
    } catch (e) {
      setError((e as Error).message)
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
        placeholder='Username'
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        required={true}
      />
      <Input
        style={{ marginTop: '8px' }}
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={true}
      />
      <Button style={{ marginTop: '8px' }} onClick={onSubmit}>
        Login
      </Button>
    </div>
  )
}

export default LoginScreen
