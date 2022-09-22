import { render, screen } from '@testing-library/react';
import { AuthStore } from '../AuthStore';
// given that there is no data in the text throw an error
// if bad data (invalid email) is entered throw an error
// if good data is entered, navigate to the next screen

import LoginScreen from "./LoginScreen";

describe('LoginScreen', () => {
    it('Displays an error if there is no data', () => {

        const authStore = new AuthStore();

        render(
            <AuthProvider authStore={authStore}>
                <LoginScreen />
            </AuthProvider>
        );

        const button = screen.getByRole('button');
        button.click();

        const emailError = screen.getByText('Please enter your email address');
        const passwordError = screen.getByText('Please enter your password');
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    });
});