import { Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAuthContext } from '../AuthContext'

const LoginScreen = () => {
  const authStore = useAuthContext()
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>(undefined)

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (email && password) {
        await authStore.attemptLogin(email, password)
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Typography style={{ marginTop: '8px' }}>3Nickels Login</Typography>
      <Input
        style={{ marginTop: '8px' }}
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required={true}
        data-testid='email'
      />
      <Input
        style={{ marginTop: '8px' }}
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={true}
        data-testid='password'
      />
      <Button style={{ marginTop: '8px' }} type='submit' onClick={onSubmit}>
        Login
      </Button>
    </form>
  )
}

export default LoginScreen
