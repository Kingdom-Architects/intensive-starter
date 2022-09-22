import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import { TwoFAScreen } from "../screens/TwoFAScreen";

export default function AppRoutes() {
    return ( 
        <Router>
            <Routes>
                <Route path="/twofa" element={<TwoFAScreen />} />
                <Route path="/" element={<LoginScreen />} />
            </Routes>
        </Router>
    )
}