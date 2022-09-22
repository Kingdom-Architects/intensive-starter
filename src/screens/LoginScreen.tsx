import { Button, Input, Typography } from '@mui/material'
import React from 'react'

const LoginScreen = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Typography style={{ marginTop: '8px' }}>3Nickels Login</Typography>
      <Input style={{ marginTop: '8px' }} />
      <Input style={{ marginTop: '8px' }} />
      <Button style={{ marginTop: '8px' }}>Login</Button>
    </div>
  )
}

export default LoginScreen
