import { render, screen, act, fireEvent } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { AuthStore } from '../AuthStore';

import TwoFAScreen from "./TwoFAScreen";
import { AuthProvider } from '../AuthContext';

describe('TwoFAScreen', () => {
    it('not calling attemptLoginTwoFactor api', async () => {

        const authStore = new AuthStore();

        authStore.attemptLoginTwoFactor = jest.fn();

        render(
            <AuthProvider authStore={authStore}>
                <TwoFAScreen />
            </AuthProvider>
        );

        const button = screen.getByRole('button');
        await act(() => button.click())

        expect(authStore.attemptLoginTwoFactor).not.toHaveBeenCalled();
    });

    it('calling attemptLoginTwoFactor api', async () => {

        const authStore = new AuthStore();

        const attemptLoginTwoFactor = jest.fn();
        authStore.attemptLoginTwoFactor = attemptLoginTwoFactor;

        render(
            <AuthProvider authStore={authStore}>
                <TwoFAScreen />
            </AuthProvider>
        );

        const twoFA = '123456'
        /* eslint-disable-next-line */
        const twoFAInput = screen.getByTestId('code').querySelector('input');

        await fireEvent.change(twoFAInput, { target: { value: twoFA } });

        const button = screen.getByRole('button');
        await act(() => { button.click()})

        expect(attemptLoginTwoFactor).toHaveBeenCalledWith(twoFA);
    });
});