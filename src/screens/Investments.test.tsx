import { render, screen, act, fireEvent } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { AuthStore } from '../AuthStore';

import Investments from "./Investments";
import { AuthProvider } from '../AuthContext';
import { API } from '../apis';
import { AxiosInstance } from 'axios';
import { InvestmentAccountApi } from '../apis/InvestmentAccountApi';
import { wait } from '../utils';

describe('Investments Screen', () => {
    const axios = mock<AxiosInstance>();
    API.investments = new InvestmentAccountApi(axios);
    
    it('Make sure screen renders properly when receiving 403(unauthenticated)', async () => {
        const authStore = new AuthStore();
        axios.get.calledWith('investment-accounts').mockReturnValue(
            Promise.resolve({
              data: [],
              status: 403,
              statusText: '',
              headers: {},
              config: {},
            }),
        );

        render(
            <AuthProvider authStore={authStore}>
                <Investments />
            </AuthProvider>
        );
        // expect screen to not render improperly when 403 is sent
        expect(await screen.findByText('No accounts')).toBeInTheDocument();
    });
    it('When we have 0 accounts and response is 200', async () => {
        const authStore = new AuthStore();
        axios.get.calledWith('investment-accounts').mockReturnValue(
            Promise.resolve({
              data: [],
              status: 200,
              statusText: '',
              headers: {},
              config: {},
            }),
        );

        render(
            <AuthProvider authStore={authStore}>
                <Investments />
            </AuthProvider>
        );
        //await wait(200);
        expect(await screen.findByText('No accounts')).toBeInTheDocument();
        // expect investments length to be 0 and no errors
        // expect()
    });
    it('When we have 1 or more accounts...', async () => {
        const authStore = new AuthStore();
        axios.get.calledWith('investment-accounts').mockReturnValue(
            Promise.resolve({
              data: [{name: 'FirstInvestment'}, {name: 'SecondInvestment'}],
              status: 200,
              statusText: '',
              headers: {},
              config: {},
            }),
        );

        render(
            <AuthProvider authStore={authStore}>
                <Investments />
            </AuthProvider>
        );

        expect(await screen.findByText('FirstInvestment')).toBeInTheDocument();
        expect(await screen.findByText('SecondInvestment')).toBeInTheDocument();
    });
});