import {  Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API } from '../apis'

import { InvestmentAccountRest } from '../apis/InvestmentAccountApi';

const Investments = () => {
    const [investments, setInvestments] = useState<InvestmentAccountRest[]>([])
    useEffect(() => {

        const getInvestments = async () => {
            const investments = await API.investments.getAll()
            setInvestments(investments.data)
        }

        getInvestments()
    }, [])
    
  return (
  <div>
    {

    investments ? investments.map((investment) => (
        <div>
            <Typography>{investment.name}</Typography>
        </div>
        )) : null
    }
  </div>)
}

export default Investments
