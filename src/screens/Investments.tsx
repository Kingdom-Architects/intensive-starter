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
    investments.length ? 
        <div>
            {investments.map((investment) => (
            <div key={investment.id} className="investments">
                <Typography>{investment.name}</Typography>
            </div>
            ))}
        </div>
        : 
        <div>No accounts</div>)
}

export default Investments
