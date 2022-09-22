import { Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAuthContext } from '../AuthContext'

export const TwoFAScreen = () => {
  const authStore = useAuthContext()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const onSubmit = async () => {
    try {
      if (code.length === 6) {
        await authStore.attemptLoginTwoFactor(code)
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Input
        style={{ marginTop: '8px' }}
        placeholder='0'
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required={true}
        data-testid='code'
      />
      <Button style={{ marginTop: '8px' }} type='submit' onClick={onSubmit}>
        Continue
      </Button>
    </form>
  )
}

export default TwoFAScreen
