import { Button, Input, Typography } from '@mui/material'
import React, { useState } from 'react'

const TwoFAScreen = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const onSubmit = async () => {
    try {
      throw new Error('invalid code')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <form>
      <Input
        style={{ marginTop: '8px' }}
        placeholder='0'
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required={true}
        data-testid='code'
      />
    </form>
  )
}
