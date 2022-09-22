import { render, screen, act, fireEvent } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { AuthStore } from '../AuthStore';
// given that there is no data in the text throw an error
// if bad data (invalid email) is entered throw an error
// if good data is entered, navigate to the next screen

import LoginScreen from "./LoginScreen";
import { AuthProvider } from '../AuthContext';
import { AUTH } from '../apis';

describe('LoginScreen', () => {
    it('not calling an api', async () => {

        const authStore = new AuthStore();

        authStore.attemptLogin = jest.fn();

        render(
            <AuthProvider authStore={authStore}>
                <LoginScreen />
            </AuthProvider>
        );

        const button = screen.getByRole('button');
        await act(() => button.click())

        expect(authStore.attemptLogin).not.toHaveBeenCalled();
    });

    it('calling an api', async () => {

        const authStore = new AuthStore();

        const attemptLogin = jest.fn();
        authStore.attemptLogin = attemptLogin;

        render(
            <AuthProvider authStore={authStore}>
                <LoginScreen />
            </AuthProvider>
        );

        const email = 'raziz@guidedchoice.com'
        const password = 'complicatedPass'

        const emailInput = screen.getByTestId('email').querySelector('input');
        const passwordInput = screen.getByTestId('password').querySelector('input');

        await fireEvent.change(emailInput, { target: { value: email } });
        await fireEvent.change(passwordInput, { target: { value: password } });

        const button = screen.getByRole('button');
        await act(() => { button.click()})

        expect(attemptLogin).toHaveBeenCalledWith(email, password);
    });
});