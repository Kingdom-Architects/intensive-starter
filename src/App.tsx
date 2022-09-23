import React from "react";
import "./App.css";
import LoginScreen from "./screens/LoginScreen";
import { ToastProvider } from "react-toast-notifications";
import { AuthProvider } from "./AuthContext";
import useConstant from "./hooks/useConstant";
import { AuthStore } from "./AuthStore";
import AppRoutes from "./routes/AppRoutes";
import { AccessToken, AccessTokenProvider } from "./apis/AccessTokenProvider";

function App(): JSX.Element {
  const authStore = useConstant<AuthStore>(() => new AuthStore());
  // @ts-ignore
  window.impersonate = (token: string) => {
    const accessToken = new AccessToken(token, token);
    AccessTokenProvider.setAccessToken(accessToken);
  };

  return (
    <AuthProvider authStore={authStore}>
      <ToastProvider autoDismiss={true} placement="top-right">
        <div className="App">
          <AppRoutes />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
